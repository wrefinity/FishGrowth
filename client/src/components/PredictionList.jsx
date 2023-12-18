import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPrediction, getPredictionStatus, getPredictionError, selectAllPrediction } from '../slicer/Prediction';
import PredictionTable from './PredictionTable';
const PredictionList = () => {
  const dispatch = useDispatch();
  const predictions = useSelector(selectAllPrediction);
  const status = useSelector(getPredictionStatus);
  const error = useSelector(getPredictionError);

  useEffect(() => {
    dispatch(getPrediction());
  }, [dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='container mt-5'>
      <h1>Predictions</h1>
      <PredictionTable predictions={predictions} />
    </div>
  );
};

export default PredictionList;
