import React from 'react';


const PredictionTable = ({ predictions }) => {
  return (
    <table className='table striped bordered hover responsive'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Temperature</th>
          <th>Turbidity</th>
          <th>Oxygen</th>
          <th>pH Value</th>
          <th>Ammonia</th>
          <th>Nitrate</th>
          <th>Population</th>
          <th>Length</th>
          <th>Weight</th>
          <th>User ID</th>
        </tr>
      </thead>
      <tbody>
        {predictions.map(prediction => (
          <tr key={prediction.id}>
            <td>{prediction.id}</td>
            <td>{prediction.temperature}</td>
            <td>{prediction.turbidity}</td>
            <td>{prediction.oxygen}</td>
            <td>{prediction.ph_value}</td>
            <td>{prediction.ammonia}</td>
            <td>{prediction.nitrate}</td>
            <td>{prediction.population}</td>
            <td>{prediction.length}</td>
            <td>{prediction.weight}</td>
            <td>{prediction.username}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PredictionTable;
