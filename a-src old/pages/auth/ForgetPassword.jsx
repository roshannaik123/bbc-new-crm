import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ContextPanel } from "../../utils/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const ForgetPassword = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    //create a formData object and append state values
    const formData = new FormData();
    formData.append("phone", phone);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(
        `${BASE_URL}/api/panel-send-password`,
        formData
      );

      if (res.data.code === 200) {
        toast.success(res.data.msg || "Password reset successfully");
        navigate("/");
      } else {
        toast.error(res.data.msg || "Password reset failed");
      }
    } catch (error) {
      console.error("An error occurred during password reset", error);
      toast.error("An error occurred during password reset");
    }

    setLoading(false);
  };

  return (
    <>
     
      <div className="flex flex-col m-0 lg:flex-row h-screen">
        {/* Left Side - Images with Animation and Background Color */}
        <div className="hidden lg:block lg:w-[50%] xl:block xl:w-[50%] h-full bg-white">
          {/* Container for the images */}
          <div className="relative w-full h-full flex flex-col justify-center items-center">
            {/* First image (top) with floating animation */}
            <div className="w-4/5 h-2/5 mb-4" style={{
              animation: "floatUpDown 3s ease-in-out infinite",
            }}>
              <img
                src="/img/em1.png"
                alt="Employee 1"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Second image (bottom) with scale animation */}
            <div className="w-4/5 h-2/5" style={{
              animation: "pulse 4s ease-in-out infinite",
            }}>
              <img
                src="/img/em2.png"
                alt="Employee 2"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* CSS for custom animations */}
          <style jsx>{`
            @keyframes floatUpDown {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </div>
        
        {/* Right Side - Form */}
        <div className="flex-1 flex items-center bg-pink-50/50 justify-center px-4 lg:px-8 py-12 h-full lg:w-1/2">
          <Card className="p-8 bg-gradient-to-r border border-[#A41460] hover:shadow-2xl transition-shadow duration-300 w-full max-w-md">
            <div className="flex justify-center mb-4">
              <img src="logo.png" alt="Company Logo" className="w-35 h-35" />
            </div>

            <Typography
              variant="h4"
              className="font-bold text-center mb-8 text-[#A41460]"
            >
              Reset Your Password
            </Typography>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  variant="static"
                  label="Mobile Number *"
                  labelProps={{ className: "!text-[#A41460]" }}
                  placeholder="Enter your mobile number"
                  name="phone"
                  minLength={10}
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-100 text-gray-700 placeholder-gray-400"
                  onKeyDown={(e) => {
                    if (!/[\d]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 bg-[#A41460] hover:bg-[#802053] transition-colors duration-300"
                >
                  {loading ? "Processing..." : "Reset Password"}
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-6">
                <Typography
                  variant="small"
                  className="text-center text-blue-gray-500 font-medium"
                >
                  Remembered your password?
                  <Link
                    to="/"
                    className="text-[#A41460] ml-1"
                  >
                    Sign In
                  </Link>
                </Typography>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;