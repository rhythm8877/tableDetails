import React, { useEffect, useState } from 'react';
import './SchoolTable.css';

// eslint-disable-next-line no-unused-vars
const activityOptions = {
  'Elementary': [
      'New Govt. Primary School', 'Const. of New Building', 'Boys toilet', 
      'Girls toilet', 'Boys toilet (Rejuvenation)', 'Girls toilet (Rejuvenation)', 
      'Additional Classrooom', 'Augmentation of EBRC', 'Boundary Wall', 
      'Boundary Wall (Rejuvenation)', 'Dilapidated Classrooms (Primary)', 
      'Dilapidated Classroom (Upper Primary)', 'Drinking Water Facility', 
      'Electrification', 'Electrification (Rejuvenation)', 'Major Repair', 
      'Major Repair (Rejuvenation)', 'Rain Water Harvesting', 
      'Upgradation of School (6-8)', 'Dilapidated Building (Primary)', 
      'Dilapidated Building (Upper Primary)'
  ],
  'Secondary': [
      'Additional Classroom', 'Art & Craft Room', 'Boundary Wall (Rejuvenation)', 
      'Boys Toilet', 'Boys Toilet (Rejuvenation)', 'Girls Toilet', 
      'Girls Toilet (Rejuvenation)', 'Computer Room', 'Drinking Water', 
      'Library Room', 'Major Repair', 'Major Repair (Rejuvenation)', 
      'New Secondary School (Section 1)', 'New Secondary School (Section 2)', 
      'Rain Water Harvesting', 'Ramp', 'Residential Quarter', 
      'Integrated Science Lab', 'Dilapidated Building', 'Electrification', 
      'Upgradation to Secondary'
  ],
  'Higher Secondary': [
      'Additional Classroom (Examination Hall)', 'Additional Classroom', 
      'Art & Craft Room', 'Computer Room', 'Dilapidated Building', 
      'Girls Toilet', 'Boys Toilet', 'Library Room', 
      'New Higher Secondary (Arts Stream)', 'New Higher Secondary (Science Stream)', 
      'Upgradation to Higher Secondary', 'Rainwater Harvesting', 'Electrification'
  ],
  'PM Shri': [
      'Major Repair', 'Solar Panel', 'Boys Toilet', 'Girls Toilet', 
      'Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Library Room'
  ],
  'KGBV-IV': [
      'Boundary Wall'
  ],
  'NSCBAV': [],
  'DA JGUA': []
};

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * SchoolAdminPanel is a React component that renders an administrative interface
 * for managing school data. It displays a table of school-related information.
 * The table includes columns for district, EBRC, UDISE, activity, school name, and
 * additional financial details for each month of the year.
 * 
 * Users can update table data through inputs and dropdowns. The component 
 * initializes the table with default rows.
 */

/*******  513f0059-3136-4306-aff7-42a0524251cb  *******/
const SchoolAdminPanel = () => {
  const [tableData, setTableData] = useState([]);
  const currentYear = 2025;

  const getRemainingFields = (year) => {
    const yearSuffix = parseInt(year.toString().slice(-2)); // Get the last two digits as a number
    const yearSuffixx = yearSuffix + 1; // Add 1 to the number

    // If you want to format it back to a two-digit string (e.g., 21 -> 22)
    const yearSuffixxFormatted = yearSuffixx.toString().padStart(2, '0');

    return [
      'PAB', 'Fund Approved', 'Civil Cost',
      `Apr'${yearSuffix}`, `May'${yearSuffix}`, `Jun'${yearSuffix}`,
      `Jul'${yearSuffix}`, `Aug'${yearSuffix}`, `Sep'${yearSuffix}`,
      `Oct'${yearSuffix}`, `Nov'${yearSuffix}`, `Dec'${yearSuffix}`,
      `Jan'${yearSuffixxFormatted}`, `Feb'${yearSuffixxFormatted}`, `Mar'${yearSuffixxFormatted}`,
      'Total Expenditure', 'Balance', 'Remarks'
    ];
  };

  const generateInitialRows = () => {
    return Array.from({ length: 5 }, () => ({
      district: '',
      ebrc: '',
      udise: '',
      activity: '',
      schoolName: '',
      others: Array(18).fill('') // Fixed length matching remainingFields structure
    }));
  };

  useEffect(() => {
    setTableData(generateInitialRows());
  }, []);

  const handleInputChange = (rowIndex, field, value, subIndex = null) => {
    const updatedRows = [...tableData];
    
    if (field === 'others') {
      // Handle numeric validation for Civil Cost and months columns (indexes 1-15)
      // Civil Cost is at index 2 and months are at indexes 3-14
      if (subIndex === 2 || (subIndex >= 3 && subIndex <= 14)) {
        // Only allow valid numbers (>=0 with optional decimals)
        // First check if the input is a valid number format
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
          // Convert to number and validate it's >= 0
          const numValue = value === '' ? '' : Number(value);
          
          // Only update if it's empty or a valid non-negative number
          if (value === '' || !isNaN(numValue) && numValue >= 0) {
            updatedRows[rowIndex][field][subIndex] = value;
          
            // After updating a value, recalculate Total Expenditure and Balance
            const monthValues = updatedRows[rowIndex].others.slice(3, 15).map(val => val === '' ? 0 : Number(val));
            const totalExpenditure = monthValues.reduce((sum, val) => sum + val, 0);
            
            // Check if any month values or civil cost have decimals
            const hasDecimals = monthValues.some(val => !Number.isInteger(val)) || 
                               !Number.isInteger(updatedRows[rowIndex].others[2] === '' ? 0 : Number(updatedRows[rowIndex].others[2]));
            
            // Update Total Expenditure (index 15)
            updatedRows[rowIndex].others[15] = hasDecimals ? 
                                               totalExpenditure.toFixed(2) : 
                                               Math.round(totalExpenditure).toString();
            
            // Update Balance (index 16) = Civil Cost - Total Expenditure
            const civilCost = updatedRows[rowIndex].others[2] === '' ? 0 : Number(updatedRows[rowIndex].others[2]);
            const balance = civilCost - totalExpenditure;
            updatedRows[rowIndex].others[16] = hasDecimals ? 
                                              balance.toFixed(2) : 
                                              Math.round(balance).toString();
          }
        }
      } else if (subIndex !== 15 && subIndex !== 16) { // Allow normal editing for non-calculated fields
        updatedRows[rowIndex][field][subIndex] = value;
      }
    } else {
      updatedRows[rowIndex][field] = value;
    }
    
    setTableData(updatedRows);
  };

  return (
    <div className="container">
      <header>
        <div className="logo">School Details</div>
      </header>

      <div className="data-container">
        <div className="table-container">
          <table>
            <thead>
              <tr >
                <th className="slno-column">Sl No.</th>
                <th className="district-column">District</th>
                <th>EBRC</th>
                <th>UDISE</th>
                <th className="activity-column">Activity</th>
                <th className="school-name-column">School Name</th>
                {getRemainingFields(currentYear).map((field, idx) => (
                  <th key={idx}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => {
                return (
                  <tr className='table-row' key={rowIndex}>
                    <td className="non-editable">{rowIndex + 1}</td>
                    
                    <td className="non-editable">
                      {row.district}
                    </td>

                    <td className="non-editable">
                      {row.ebrc}
                    </td>

                    <td className="non-editable">
                      {row.udise}
                    </td>

                    <td className="non-editable">
                      {row.activity}
                    </td>

                    <td className="non-editable">
                      {row.schoolName}
                    </td>

                    {getRemainingFields(currentYear).map((field, idx) => {
                      // Determine if this is a calculated field
                      const isCalculatedField = field === 'Total Expenditure' || field === 'Balance';
                      // Check if this is a numeric field
                      const isNumericField = field === 'Civil Cost' || 
                                            field.includes('Apr') || field.includes('May') || 
                                            field.includes('Jun') || field.includes('Jul') || 
                                            field.includes('Aug') || field.includes('Sep') || 
                                            field.includes('Oct') || field.includes('Nov') || 
                                            field.includes('Dec') || field.includes('Jan') || 
                                            field.includes('Feb') || field.includes('Mar');
                      
                      return (
                        <td key={idx}>
                          {isCalculatedField ? (
                            <div className="non-editable calculated-field">
                              {row.others?.[idx] || '0'}
                            </div>
                          ) : (
                            <input
                              type={isNumericField ? "text" : "text"}
                              pattern={isNumericField ? "^\\d*\\.?\\d*$" : undefined}
                              inputMode={isNumericField ? "decimal" : "text"}
                              min={isNumericField ? "0" : undefined}
                              value={row.others?.[idx] || ''}
                              onChange={e => handleInputChange(rowIndex, 'others', e.target.value, idx)}
                              placeholder={
                                field === 'PAB' ? "Enter PAB" :
                                field === 'Civil Cost' ? "Enter Cost" :
                                field === 'Remarks' ? "Enter Remarks" :
                                "Enter value"
                              }
                              onKeyPress={isNumericField ? (event) => {
                                // Block any character that isn't a digit or decimal point
                                const charCode = event.which ? event.which : event.keyCode;
                                if ((charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) ||
                                   (charCode === 46 && event.target.value.includes('.'))) {
                                  event.preventDefault();
                                }
                              } : undefined}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminPanel;