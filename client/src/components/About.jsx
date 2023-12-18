import React from 'react';
import photo1 from "../assets/images/photo1.jpeg";
import photo2 from "../assets/images/photo2.jpeg";
import photo3 from "../assets/images/photo3.jpeg";
import img1 from "../assets/images/images (1).jpeg";
import acqua from "../assets/images/DIY-aquaponic-plans.jpg";
import pond9 from "../assets/images/9-Ponds-fitted-with-Plant-beds-Day-23-scaled.jpg";

const About = () => {
  return (
    <>
      <div className="container mt-3">
        <h1 className="text-center" style={{ fontWeight: 'bolder', textTransform: 'capitalize', fontFamily: 'Verdana, Geneva, Tahoma, sans-serif' }}>
          ABOUT AQUAPONICS FISH POND
        </h1>
        <p>
          Many in sub-Saharan Africa live below the poverty line, leading to low protein intake from sources like meat or fish. Aquaculture, the science of breeding fish for local protein consumption and commercial gains is gaining ground in Africa, though very slowly. One of the challenges being setup cost. Others include the unavailability and unaffordability of the major raw materials like quality water and water monitoring devices and fish feed.
        </p>
        <p>
          Lack of datasets and documentation on monitoring growth parameters hamper the effective management and prediction of yields. Water quality impacts on the fish growth rate, feed consumption, and general wellbeing. Aquaponics is the system that combines conventional aquaculture (the raising of aquatic animals such as fish) with hydroponics (the method of growing plants in water i.e. soil-less farming of crops). It uses these two technologies in a symbiotic combination in which the plant uses the waste from the fish as food while at the same time filtering the water for immediate re-use by the fish.
        </p>
        <p>
          The system offers a diverse and stable platform for farmers to grow vegetables and fish together. This project is aimed at building a remotely monitored and controlled Internet of Things (IoT) fishpond water quality management system for the generation of labelled datasets both for the conventional ponds and the aquaponic pond systems.
        </p>
        <p>
          These datasets will enable machine learning researchers to build models for predicting fish yield in the aquaponics production system in terms of weight gain, water quality parameters, and feed consumption.
        </p>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-4 p-2">
            <img src={photo1} width="100%" height="300px" alt="" />
          </div>
          <div className="col-md-4 p-2">
            <img src={photo3} width="100%" height="300px" alt="" />
          </div>
          <div className="col-md-4 p-2">
            <img src={photo2} width="100%" height="300px" alt="" />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-4 p-2">
            <img src={acqua} width="100%" height="300px" alt="" />
          </div>
          <div className="col-md-4 p-2">
            <img src={pond9} width="100%" height="300px" alt="" />
          </div>
          <div className="col-md-4 p-2">
            <img src={img1} width="100%" height="300px" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
