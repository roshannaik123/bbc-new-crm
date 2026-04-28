import { Input, Checkbox, Button, Typography, Textarea, Card } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    formData.append("username", email);
    formData.append("password", password);

    try {
      // Send POST request to login API with form data
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);

      if (res.status === 200) {
        const token = res.data.UserInfo?.token;
        const adminType = res.data.UserInfo?.user?.admin_type;
        const detailsView = res.data.UserInfo?.user?.details_view;
        const UserName = res.data.UserInfo?.user?.mobile;
        if (token) {
          // Store the token in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("admin-type", adminType);
          localStorage.setItem("details-view", detailsView);
          localStorage.setItem("username", UserName);
          navigate("/home");
          toast.success("Login Succesfully");
        } else {
          toast.error("Login Failed, credentials doesn't match");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };

  return (
    <>
   
      <div className="flex flex-col m-0 lg:flex-row h-screen">
        {/* Left Side - Images with Animation and Background Color */}
        <div className="hidden lg:block lg:w-[50%] xl:block xl:w-[50%] h-full bg-white overflow-hidden">
          {/* SVG Geometric Pattern - Top */}
          <svg 
            className="absolute top-0 left-0 w-full opacity-15" 
            height="200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Pattern */}
            <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#A41460" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" />
            
            {/* Dots Pattern */}
            <g>
              {Array.from({ length: 15 }).map((_, i) => (
                <circle 
                  key={i} 
                  cx={Math.random() * 500} 
                  cy={Math.random() * 200} 
                  r={Math.random() * 3 + 1} 
                  fill="#A41460" 
                  opacity={Math.random() * 0.5 + 0.1}>
                  <animate 
                    attributeName="opacity" 
                    values={`${Math.random() * 0.3 + 0.1};${Math.random() * 0.5 + 0.3};${Math.random() * 0.3 + 0.1}`} 
                    dur={`${Math.random() * 3 + 2}s`} 
                    repeatCount="indefinite" 
                  />
                </circle>
              ))}
            </g>
          </svg>

          {/* Container for the images */}
          <div className="relative w-full h-full flex flex-col justify-center items-center z-10">
            {/* SVG Abstract Shapes - Left Side */}
            <svg 
              className="absolute left-0 top-1/4 h-40 w-40 opacity-30" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                animation: "rotateClockwise 20s linear infinite",
              }}
            >
              {/* Abstract geometric shapes */}
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="#A41460" strokeWidth="1" strokeDasharray="5,3" />
              <rect x="30" y="30" width="40" height="40" fill="none" stroke="#A41460" strokeWidth="0.8" transform="rotate(15, 50, 50)" />
              <rect x="35" y="35" width="30" height="30" fill="none" stroke="#A41460" strokeWidth="0.6" transform="rotate(30, 50, 50)" />
              <rect x="40" y="40" width="20" height="20" fill="#A41460" opacity="0.1" transform="rotate(45, 50, 50)" />
            </svg>

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

            {/* SVG Connected Dots - Between Images */}
            <svg 
              className="h-20 w-64 mx-auto mb-4 opacity-70" 
              viewBox="0 0 160 50" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                animation: "pulse 4s ease-in-out infinite",
              }}
            >
              <circle cx="20" cy="25" r="4" fill="#A41460" opacity="0.6" />
              <circle cx="50" cy="25" r="4" fill="#A41460" opacity="0.6" />
              <circle cx="80" cy="25" r="4" fill="#A41460" opacity="0.6" />
              <circle cx="110" cy="25" r="4" fill="#A41460" opacity="0.6" />
              <circle cx="140" cy="25" r="4" fill="#A41460" opacity="0.6" />
              
              <line x1="20" y1="25" x2="50" y2="25" stroke="#A41460" strokeWidth="1.5" />
              <line x1="50" y1="25" x2="80" y2="25" stroke="#A41460" strokeWidth="1.5" />
              <line x1="80" y1="25" x2="110" y2="25" stroke="#A41460" strokeWidth="1.5" />
              <line x1="110" y1="25" x2="140" y2="25" stroke="#A41460" strokeWidth="1.5" />
              
              <circle cx="20" cy="25" r="2" fill="#fff">
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="25" r="2" fill="#fff">
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="0.4s" />
              </circle>
              <circle cx="80" cy="25" r="2" fill="#fff">
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="0.8s" />
              </circle>
              <circle cx="110" cy="25" r="2" fill="#fff">
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="1.2s" />
              </circle>
              <circle cx="140" cy="25" r="2" fill="#fff">
                <animate attributeName="r" values="2;3;2" dur="2s" repeatCount="indefinite" begin="1.6s" />
              </circle>
            </svg>

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

            {/* SVG Circuit Pattern - Right Side */}
            <svg 
              className="absolute right-0 bottom-1/4 h-40 w-32 opacity-30" 
              viewBox="0 0 100 120" 
              xmlns="http://www.w3.org/2000/svg"
              style={{
                animation: "floatUpDown 5s ease-in-out infinite",
              }}
            >
              {/* Circuit-like pattern */}
              <line x1="20" y1="10" x2="80" y2="10" stroke="#A41460" strokeWidth="1.5" />
              <line x1="80" y1="10" x2="80" y2="40" stroke="#A41460" strokeWidth="1.5" />
              <line x1="80" y1="40" x2="20" y2="40" stroke="#A41460" strokeWidth="1.5" />
              <line x1="20" y1="40" x2="20" y2="70" stroke="#A41460" strokeWidth="1.5" />
              <line x1="20" y1="70" x2="80" y2="70" stroke="#A41460" strokeWidth="1.5" />
              <line x1="80" y1="70" x2="80" y2="100" stroke="#A41460" strokeWidth="1.5" />
              <line x1="80" y1="100" x2="20" y2="100" stroke="#A41460" strokeWidth="1.5" />
              
              <circle cx="20" cy="10" r="3" fill="#A41460" />
              <circle cx="80" cy="10" r="3" fill="#A41460" />
              <circle cx="80" cy="40" r="3" fill="#A41460" />
              <circle cx="20" cy="40" r="3" fill="#A41460" />
              <circle cx="20" cy="70" r="3" fill="#A41460" />
              <circle cx="80" cy="70" r="3" fill="#A41460" />
              <circle cx="80" cy="100" r="3" fill="#A41460" />
              <circle cx="20" cy="100" r="3" fill="#A41460" />
              
              <circle cx="50" cy="40" r="6" fill="#A41460" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="70" r="6" fill="#A41460" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </circle>
            </svg>
          </div>

          {/* SVG Isometric Pattern - Bottom */}
          <svg 
            className="absolute bottom-0 left-0 w-full opacity-15" 
            height="200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Isometric Grid Pattern */}
            <pattern id="isometric" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 15 L 15 0 L 30 15 L 15 30 Z" fill="none" stroke="#A41460" strokeWidth="0.5" opacity="0.4"/>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#isometric)" />
            
            {/* Floating Squares */}
            <g>
              {Array.from({ length: 6 }).map((_, i) => (
                <rect 
                  key={i} 
                  x={Math.random() * 450} 
                  y={Math.random() * 170} 
                  width="15" 
                  height="15" 
                  fill="#A41460" 
                  opacity={Math.random() * 0.2 + 0.1}
                  transform={`rotate(${Math.random() * 45}, ${Math.random() * 450 + 7.5}, ${Math.random() * 170 + 7.5})`}>
                  <animate 
                    attributeName="y" 
                    values={`${Math.random() * 170};${Math.random() * 170 - 10};${Math.random() * 170}`} 
                    dur={`${Math.random() * 4 + 3}s`} 
                    repeatCount="indefinite" 
                  />
                </rect>
              ))}
            </g>
          </svg>

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

            @keyframes rotateClockwise {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @keyframes rotateCounterClockwise {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
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
              Sign into your account
            </Typography>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  
                  variant="static"
                  label="Mobile Number *"
                  labelProps={{ className: "!text-[#A41460]" }}
                  placeholder="Enter your mobile number"
                  name="email"
                  maxLength={10}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 text-gray-700 placeholder-gray-400"
                  onKeyDown={(e) => {
                    if (!/[\d]/.test(e.key) && e.key !== "Backspace" && e.key !== "ArrowLeft" && e.key !== "ArrowRight"&& e.key !== "Tab") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Typography
                    variant="small"
                    className="text-[#A41460] font-medium"
                  >
                    Password *
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-medium text-[#A41460]"
                    
                  >
                    <Link tabIndex={-1} to="/forget-password">Forgot Password?</Link>
                  </Typography>
                </div>
                <Input
                  variant="static"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
             
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 text-gray-700 placeholder-gray-400"
                  labelProps={{ className: "!text-[#A41460]" }}
                />
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-3 bg-[#A41460] hover:bg-[#802053] transition-colors duration-300"
                >
                  {loading ? "Checking..." : "Sign In"}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                <Typography
                  variant="small"
                  className="text-center text-blue-gray-500 font-medium"
                >
                  Not registered?
                  <Link
                    target="blank"
                    to="https://businessboosters.club/register"
                    className="text-[#A41460] ml-1"
                  >
                    Create account
                  </Link>
                </Typography>
              </div>
              <div className="flex items-center justify-center ">
                <Link
                  to="https://businessboosters.club/"
                  className="flex items-center gap-2 text-gray-700 hover:text-[#802053] transition-colors duration-300"
                >
                  <FaArrowLeft className="h-3 w-3 " /> <span className="text-sm">Back to your website</span>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SignIn;