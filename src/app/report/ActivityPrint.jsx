import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORT_API, USER_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { toast } from "sonner";
import { Download, FileText, Loader2, Search } from "lucide-react";
import moment from "moment";

const ActivityPrint = () => {
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedPType, setSelectedPType] = useState("");
  const [pTypes, setPTypes] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isPTypesLoading, setIsPTypesLoading] = useState(false);
  const [totalAttendance, setTotalAttendance] = useState(0);
  const { trigger: apiTrigger } = useApiMutation();

  useEffect(() => {
    fetchPTypes();
  }, []);

  const fetchPTypes = async () => {
    try {
      setIsPTypesLoading(true);
      const res = await apiTrigger({
        url: USER_API.fetchPType,
        method: "get",
      });
      const data = res?.data || res || [];
      setPTypes(data);
    } catch (error) {
      console.error("Failed to fetch group types:", error);
    } finally {
      setIsPTypesLoading(false);
    }
  };

  const handleFetchReport = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both from and to dates");
      return;
    }
    if (!selectedPType) {
      toast.error("Please select Group Type");
      return;
    }

    try {
      setIsFetching(true);
      const res = await apiTrigger({
        url: REPORT_API.attendance,
        method: "post",
        data: {
          from_date: fromDate,
          to_date: toDate,
          p_type: selectedPType,
        },
      });

      const data = res?.data || res || [];
      setReportData(Array.isArray(data) ? data : []);
      setTotalAttendance(res?.totalattendanceCount);
      if (Array.isArray(data) && data.length === 0) {
        toast.info("No records found for the selected filters");
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
      toast.error("Failed to fetch report data");
    } finally {
      setIsFetching(false);
    }
  };

  const preparePrintData = () => {
    const above70 = [];
    const mid50to69 = [];
    const below50 = [];

    const refReceived = reportData
      .filter((item) => Number(item.ref_received) > 0)
      .map((item) => ({ name: item.name, amount: item.ref_received }));

    const refGiven = reportData
      .filter((item) => Number(item.ref_given) > 0)
      .map((item) => ({ name: item.name, amount: item.ref_given }));

    const oneToOne = reportData
      .filter((item) => Number(item.onetoone_count) > 0)
      .map((item) => ({ name: item.name, amount: item.onetoone_count }));

    const teamPoints = reportData
      .filter((item) => Number(item.team_points) > 0)
      .map((item) => ({ name: item.name, amount: item.team_points }));

    const visitors = reportData
      .filter((item) => Number(item.visitor_count) > 0)
      .map((item) => ({ name: item.name, amount: item.visitor_count }));

    const newJoining = reportData
      .filter((item) => Number(item.newjoining_count) > 0)
      .map((item) => ({ name: item.name, amount: item.newjoining_count }));

    const total = totalAttendance;

    reportData.forEach((item) => {
      const percent = total ? (Number(item.attendance_count) / total) * 100 : 0;
      const obj = { name: item.name, count: item.attendance_count };

      if (percent >= 70) above70.push(obj);
      else if (percent >= 50) mid50to69.push(obj);
      else below50.push(obj);
    });

    return {
      refReceived,
      refGiven,
      oneToOne,
      teamPoints,
      visitors,
      newJoining,
      above70,
      mid50to69,
      below50,
    };
  };

  const {
    refReceived,
    refGiven,
    oneToOne,
    teamPoints,
    visitors,
    newJoining,
    above70,
    mid50to69,
    below50,
  } = preparePrintData();

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gray-50/50 print:bg-white print:p-0">
      {/* 
        ✅ BULLETPROOF PRINT CSS 
        Using !important to guarantee nothing in your dashboard layout can override this and hide the data.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                margin: 15mm;
              }
              body {
                background-color: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print { display: none !important; }
              
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              .break-inside-avoid { break-inside: avoid; }
            }
          `,
        }}
      />

      {/* ❌ FILTERS (Hidden during print) */}
      <Card className="shadow-md border-t-4 border-t-primary print:hidden no-print">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Activity Print
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                required
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                required
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Group Type</Label>
              <Select
                required
                value={selectedPType}
                onValueChange={setSelectedPType}
                disabled={isPTypesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  {pTypes.map((type) => {
                    const value = type.p_type || type.name || type;
                    return (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleFetchReport}
                className="flex-1"
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Fetch
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                disabled={reportData.length === 0 || isFetching}
                className="border-green-600 text-green-600 "
              >
                <Download className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ✅ PRINTABLE AREA */}
      <div className="printable-area bg-white mx-auto print:max-w-none">
        {/* PRINT ONLY HEADER */}
        <div className="hidden print:block text-center mb-4">
          <h2 className="text-xl font-bold">Activity Report</h2>
          <p>
            From: {moment(fromDate).format("DD-MM-YYYY")} | To:{" "}
            {moment(toDate).format("DD-MM-YYYY")}
          </p>
        </div>

        {/* TABLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 print:flex print:flex-wrap gap-4 mt-6">
          {/* Ref Received */}
          <div className="border border-black rounded-sm p-4 bg-white print:w-[calc(33.33%-1rem)]">
            <h3 className="font-bold border-b border-black pb-2 mb-3">
              Ref Received
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {refReceived.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-500 p-2 border border-gray-300"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  refReceived.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="p-2 text-right font-medium border border-gray-300">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Ref Given */}
          <div className="border border-black rounded-sm p-4 bg-white print:w-[calc(33.33%-1rem)]">
            <h3 className="font-bold border-b border-black pb-2 mb-3">
              Ref Given
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {refGiven.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-500 p-2 border border-gray-300"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  refGiven.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="p-2 text-right font-medium border border-gray-300">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* One to One */}
          <div className="border border-black rounded-sm p-4 bg-white print:w-[calc(33.33%-1rem)]">
            <h3 className="font-bold border-b border-black pb-2 mb-3">
              One to One
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {oneToOne.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-500 p-2 border border-gray-300"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  oneToOne.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="p-2 text-right font-medium border border-gray-300">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Team Points */}
          <div className="border border-black rounded-sm p-4 bg-white print:w-[calc(33.33%-1rem)]">
            <h3 className="font-bold border-b border-black pb-2 mb-3">
              Team Points
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamPoints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-500 p-2 border border-gray-300"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  teamPoints.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="p-2 text-right font-medium border border-gray-300">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Visitors */}
          <div className="border border-black rounded-sm p-4 bg-white print:w-[calc(33.33%-1rem)]">
            <h3 className="font-bold border-b border-black pb-2 mb-3">
              Visitors
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {visitors.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-500 p-2 border border-gray-300"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  visitors.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="p-2 text-right font-medium border border-gray-300">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* New Joining */}
          <div className="border border-black rounded-sm p-4 bg-white print:w-[calc(33.33%-1rem)]">
            <h3 className="font-bold border-b border-black pb-2 mb-3">
              New Joining
            </h3>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Name</th>
                  <th className="border border-gray-300 p-2 text-right">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {newJoining.length === 0 ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center text-gray-500 p-2 border border-gray-300"
                    >
                      No data
                    </td>
                  </tr>
                ) : (
                  newJoining.map((item, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-gray-300">
                        {item.name}
                      </td>
                      <td className="p-2 text-right font-medium border border-gray-300">
                        {item.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance Area */}
        <div className="w-full max-w-none rounded-lg p-6 print:p-0 bg-white mt-8 print:mt-6">
          <h2 className="text-lg font-bold border-b border-black pb-3 mb-5">
            Attendance - ( Meeting - {totalAttendance} )
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 print:flex print:flex-wrap gap-8 print:gap-4 w-full">
            {/* ABOVE 70 */}
            <div className="border border-black rounded-sm p-4 min-h-[120px] print:w-[calc(33.33%-1rem)]">
              <h3 className="font-bold text-green-700 border-b border-gray-300 pb-2 mb-4">
                Above 70%
              </h3>
              {above70.length === 0 ? (
                <div className="text-center text-gray-400 py-6">No data</div>
              ) : (
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <tbody>
                    {above70.map((item, i) => (
                      <tr key={i}>
                        <td className="py-1 border-b border-gray-200">
                          {item.name}
                        </td>
                        <td className="text-right py-1 border-b border-gray-200">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* 50-69 */}
            <div className="border border-black rounded-sm p-4 min-h-[120px] print:w-[calc(33.33%-1rem)]">
              <h3 className="font-bold text-yellow-600 border-b border-gray-300 pb-2 mb-4">
                50% - 69%
              </h3>
              {mid50to69.length === 0 ? (
                <div className="text-center text-gray-400 py-6">No data</div>
              ) : (
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <tbody>
                    {mid50to69.map((item, i) => (
                      <tr key={i}>
                        <td className="py-1 border-b border-gray-200">
                          {item.name}
                        </td>
                        <td className="text-right py-1 border-b border-gray-200">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* BELOW 50 */}
            <div className="border border-black rounded-sm p-4 min-h-[120px] print:w-[calc(33.33%-1rem)]">
              <h3 className="font-bold text-red-600 border-b border-gray-300 pb-2 mb-4">
                Below 50%
              </h3>
              {below50.length === 0 ? (
                <div className="text-center text-gray-400 py-6">No data</div>
              ) : (
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <tbody>
                    {below50.map((item, i) => (
                      <tr key={i}>
                        <td className="py-1 border-b border-gray-200">
                          {item.name}
                        </td>
                        <td className="text-right py-1 border-b border-gray-200">
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPrint;
