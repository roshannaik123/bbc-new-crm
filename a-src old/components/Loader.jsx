import React from "react";
import Layout from "../layout/Layout";

const Loader = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100/1 backdrop-blur-sm fixed inset-0 z-50">
        <div className="flex items-center justify-center w-24 h-24 gap-1">
          <span
            className="w-1 h-12 bg-blue-500 animate-scale"
            style={{ animationDuration: "0.9s" }}
          ></span>
          <span
            className="w-1 h-12 bg-green-500 animate-scale"
            style={{ animationDuration: "0.9s", animationDelay: "-0.8s" }}
          ></span>
          <span
            className="w-1 h-12 bg-yellow-500 animate-scale"
            style={{ animationDuration: "0.9s", animationDelay: "-0.7s" }}
          ></span>
          <span
            className="w-1 h-12 bg-yellow-500 animate-scale"
            style={{ animationDuration: "0.9s", animationDelay: "-0.6s" }}
          ></span>
          <span
            className="w-1 h-12 bg-blue-600 animate-scale"
            style={{ animationDuration: "0.9s", animationDelay: "-0.5s" }}
          ></span>
        </div>

        <p className="mt-4 text-lg font-medium text-gray-700">
          Loading, please wait...
        </p>
      </div>
    </Layout>
  );
};

export default Loader;
