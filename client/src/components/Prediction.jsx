import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  handleInput,
  loaderSize,
  loaderColor,
  validate,
  validateEmpty,
} from "../utills/InputHelpers";
import { reseter, createPrediction } from "../slicer/Prediction";



const Prediction = () => {
  const { status, message } = useSelector((state) => state.prediction);
  const [predictionData, setPredictionData] = useState(null);
  const [formData, setForm] = useState({
    temperature: "23.75",
    turbidity: "80",
    oxygen: "27.736",
    ph_value: "7.04911",
    ammonia: "5.15546",
    nitrate: "114",
    population: "50",
    length: "6.74",
  });



  const reset = () => {
    setForm({
      temperature: "",
      turbidity: "",
      oxygen: "",
      ph_value: "",
      ammonia: "",
      nitrate: "",
      population: "",
      length: "",
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  

    try {
      // console.log()
      // setSuccess('')
      if ( Object.keys(validateEmpty(formData)).length === 0){
         const token = JSON.parse(localStorage.getItem("user")).token.access_token;
        const response = await fetch('http://localhost:8000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const responseData = await response.json();
          setPredictionData(responseData);
          reset();
          // setSuccess("user registered")
          console.log(responseData)
        }
      }else{
        // setSuccess("all field required")
        console.error("data not send")
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <>
      <div className="container mt-5">
        
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6">
            <form id="predictionForm" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Temperature"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="turbidity"
                  value={formData.turbidity}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Turbidity"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="oxygen"
                  value={formData.oxygen}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Dissolved Oxygen"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="ph_value"
                  value={formData.ph_value}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the pH Value"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="ammonia"
                  value={formData.ammonia}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Ammonia"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="nitrate"
                  value={formData.nitrate}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Nitrate"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="population"
                  value={formData.population}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Population"
                />
                <input
                  type="text"
                  className="form-control mt-2"
                  id="exampleFormControlInput1"
                  name="length"
                  value={formData.length}
                  onChange={(e) => handleInput(e, setForm)} 
                  placeholder="Enter the Length"
                />
              </div>
              <input
                className="b mb-5 p-2 mt-2 rounded bg-primary text-white"
                type="submit"
                value="Submit"
              />
            </form>
          </div>
        </div>

        <div className="row justify-content-center text-center">
        {predictionData && (
          <div>
            <h2>Prediction Result</h2>
            <p>Prediction: {predictionData.prediction}</p>

            <h3>Prediction Details</h3>
            
              {Object.entries(predictionData.db_prediction).map(([key, value]) => (
                <p key={key}>
                  {key}: {value}
                </p>
              ))}
            
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Prediction;
