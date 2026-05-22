import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MEETING_API, MEMBER_API, GUEST_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const AttendanceModal = ({ open, onClose, meetingId }) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [step, setStep] = useState("attendance"); // "attendance" or "visitors"

  const ITEMS_PER_PAGE = 10;

  const createInitialVisitorRow = () => ({
    guest_date: format(new Date(), "yyyy-MM-dd"),
    guest_type: "Visitor",
    guest_from_id: "",
    guest_description: "",
  });

  const [visitorRows, setVisitorRows] = useState([createInitialVisitorRow()]);

  // API to fetch active members
  const { data: membersRes, isLoading: membersLoading } = useGetApiMutation({
    url: MEMBER_API.fetchActiveMembers,
    queryKey: ["active-members"],
    options: { enabled: open },
  });

  // API to fetch meeting details
  const { data: meetingRes, isLoading: meetingLoading } = useGetApiMutation({
    url: meetingId ? MEETING_API.byId(meetingId) : "",
    queryKey: ["meeting", meetingId],
    options: { enabled: open && !!meetingId },
  });

  const { trigger: saveAttendance, loading: saveLoading } = useApiMutation();
  const { trigger: saveGuest, loading: saveGuestLoading } = useApiMutation();

  const members = membersRes?.data || membersRes || [];

  useEffect(() => {
    if (open && members.length > 0 && meetingRes) {
      const meetingData = meetingRes.data || meetingRes;
      setSearchTerm("");
      const existingAttendanceStr = meetingData.meeting_attendance || "";
      const existingIds = new Set(
        existingAttendanceStr
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id),
      );

      const preSelected = members.filter((m) =>
        existingIds.has(m.id.toString()),
      );
      setSelectedMembers(preSelected);
      setStep("attendance");
      setVisitorRows([createInitialVisitorRow()]);
      setCurrentPage(1);
    } else if (!open) {
      setSelectedMembers([]);
      setSearchTerm("");
      setStep("attendance");
      setVisitorRows([createInitialVisitorRow()]);
      setCurrentPage(1);
    }
  }, [open, members.length, meetingRes]);

  const handleToggleMember = (member) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.id === member.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMembers(members);
    } else {
      setSelectedMembers([]);
    }
  };

  const filteredMembers = members.filter((m) =>
    (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("ellipsis-1");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-2");
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAddVisitorRow = () => {
    setVisitorRows((prev) => [...prev, createInitialVisitorRow()]);
  };

  const handleRemoveVisitorRow = (index) => {
    if (visitorRows.length === 1) {
      toast.error("At least one visitor row is required.");
      return;
    }
    setVisitorRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeVisitorRow = (index, field, value) => {
    setVisitorRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubmitAttendance = async (shouldAddVisitor = false) => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    try {
      const memberIdsStr = selectedMembers.map((m) => m.id).join(",");
      const res = await saveAttendance({
        url: MEETING_API.updateAttendance(meetingId),
        method: "put",
        data: { meeting_attendance: memberIdsStr },
      });

      if (res?.code === 200 || res?.success || res?.status === 200) {
        toast.success(
          res.message || res.msg || "Attendance updated successfully",
        );
        queryClient.invalidateQueries(["active-meetings"]);
        queryClient.invalidateQueries(["inactive-meetings"]);
        
        if (shouldAddVisitor) {
          setStep("visitors");
        } else {
          onClose();
        }
      } else {
        toast.error(res?.message || res?.msg || "Failed to update attendance");
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error?.response?.data?.msg;
      toast.error(errorMsg || "Error updating attendance. Please try again.");
    }
  };

  const handleSubmitVisitors = async (e) => {
    e.preventDefault();

    // Validations
    for (let i = 0; i < visitorRows.length; i++) {
      if (!visitorRows[i].guest_from_id) {
        toast.error(`Please select a member for visitor #${i + 1}`);
        return;
      }
    }

    try {
      // Save all visitors
      await Promise.all(
        visitorRows.map((row) =>
          saveGuest({
            url: GUEST_API.create,
            method: "post",
            data: row,
          }),
        ),
      );

      toast.success(`${visitorRows.length} Visitor(s) added successfully`);
      queryClient.invalidateQueries(["guest-list"]);
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to save visitor records");
    }
  };

  const isAllSelected =
    members.length > 0 && selectedMembers.length === members.length;
  const isLoading = membersLoading || meetingLoading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "transition-all duration-300",
          step === "attendance"
            ? "max-w-md md:max-w-[90vw]"
            : "max-w-4xl md:max-w-[90vw] max-h-[90vh] flex flex-col p-6",
        )}
        aria-describedby={undefined}
      >
        {step === "attendance" ? (
          <>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <p className="text-sm text-gray-500">
                Select members who attended this meeting
              </p>
            </DialogHeader>

            {isLoading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search Member..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>

                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label
                      htmlFor="select-all"
                      className="font-semibold cursor-pointer"
                    >
                      Select All ({members.length})
                    </Label>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {selectedMembers.length} selected
                  </span>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                    {filteredMembers.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm">
                        No members found matching "{searchTerm}"
                      </div>
                    ) : (
                      paginatedMembers.map((member) => {
                        const isChecked = selectedMembers.some(
                          (m) => m.id === member.id,
                        );
                        return (
                          <div
                            key={member.id}
                            className="flex items-center space-x-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                          >
                            <Checkbox
                              id={`member-${member.id}`}
                              checked={isChecked}
                              onCheckedChange={() => handleToggleMember(member)}
                            />
                            <div className="flex flex-col flex-1 leading-none">
                              <Label
                                htmlFor={`member-${member.id}`}
                                className="font-medium text-sm cursor-pointer mb-1"
                              >
                                {member.name}
                              </Label>
                              <span className="text-xs text-gray-500">
                                Mobile: {member.mobile}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      Showing {startIndex + 1}-
                      {Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)}{" "}
                      of {filteredMembers.length}
                    </span>
                    <Pagination className="w-auto mx-0">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {getPageNumbers().map((page, idx) => {
                          if (
                            page === "ellipsis-1" ||
                            page === "ellipsis-2"
                          ) {
                            return (
                              <PaginationItem key={`ellipsis-${idx}`}>
                                <span className="px-2 text-gray-400">...</span>
                              </PaginationItem>
                            );
                          }
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages}
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={saveLoading}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleSubmitAttendance(false)}
                disabled={
                  saveLoading || isLoading || selectedMembers.length === 0
                }
              >
                {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Attendance
              </Button>
              <Button
                onClick={() => handleSubmitAttendance(true)}
                disabled={
                  saveLoading || isLoading || selectedMembers.length === 0
                }
              >
                {saveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Attendance & Add Visitor
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="pb-4 border-b">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Add Visitors / Guests
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Enter the details for each visitor. You can add multiple rows.
              </p>
            </DialogHeader>

            <form
              onSubmit={handleSubmitVisitors}
              className="flex-1 flex flex-col min-h-0"
            >
              {/* Scrollable Container for Rows */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-[200px] max-h-[50vh]">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-3 pb-2 px-1 text-xs font-semibold text-gray-500 border-b border-gray-100">
                  <div className="col-span-3">Date *</div>
                  <div className="col-span-2">Type *</div>
                  <div className="col-span-3">Invited By (Member) *</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-1 text-center">Action</div>
                </div>

                {visitorRows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-1 bg-white border border-gray-100 rounded-lg md:border-none md:bg-transparent md:items-center relative"
                  >
                    {/* Date Input */}
                    <div className="col-span-1 md:col-span-3 space-y-1 md:space-y-0">
                      <Label className="md:hidden text-xs font-semibold text-gray-500">
                        Date *
                      </Label>
                      <Input
                        type="date"
                        value={row.guest_date}
                        onChange={(e) =>
                          handleChangeVisitorRow(
                            index,
                            "guest_date",
                            e.target.value,
                          )
                        }
                        required
                        className="h-9"
                      />
                    </div>

                    {/* Type Selection */}
                    <div className="col-span-1 md:col-span-2 space-y-1 md:space-y-0">
                      <Label className="md:hidden text-xs font-semibold text-gray-500">
                        Type *
                      </Label>
                      <Select
                        value={row.guest_type}
                        onValueChange={(val) =>
                          handleChangeVisitorRow(index, "guest_type", val)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Visitor">Visitor</SelectItem>
                          <SelectItem value="Chief Guest">Chief Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sponsoring Member Selection */}
                    <div className="col-span-1 md:col-span-3 space-y-1 md:space-y-0">
                      <Label className="md:hidden text-xs font-semibold text-gray-500">
                        Invited By *
                      </Label>
                      <Select
                        value={row.guest_from_id}
                        onValueChange={(val) =>
                          handleChangeVisitorRow(index, "guest_from_id", val)
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select Member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((m) => (
                            <SelectItem key={m.id} value={m.id.toString()}>
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Description Input */}
                    <div className="col-span-1 md:col-span-3 space-y-1 md:space-y-0">
                      <Label className="md:hidden text-xs font-semibold text-gray-500">
                        Description
                      </Label>
                      <Input
                        placeholder="Enter details..."
                        value={row.guest_description}
                        onChange={(e) =>
                          handleChangeVisitorRow(
                            index,
                            "guest_description",
                            e.target.value,
                          )
                        }
                        className="h-9"
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center pt-2 md:pt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVisitorRow(index)}
                        disabled={visitorRows.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVisitorRow}
                  className="flex items-center justify-center gap-2 border-dashed border-gray-300 text-gray-600 hover:text-primary hover:border-primary transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={saveGuestLoading}
                  >
                    Skip / Close
                  </Button>
                  <Button type="submit" disabled={saveGuestLoading}>
                    {saveGuestLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Visitors
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceModal;
