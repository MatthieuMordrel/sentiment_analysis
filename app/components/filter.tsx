import React from 'react';

// Define the TypeScript interface for the props that will be passed to the SourceDropdown component
interface SourceDropdownProps {
  sources: string[]; // An array of strings representing the available sources
  selectedSource: string; // The currently selected source
  onSelectSource: (source: string) => void; // A dummy function to call when a new source is selected. It does not return anything ans is use to update the state of setSelectSource
} //This function actually "becomes" the setSelectedSource and takes a string the one which serves updatin ghte  ste

// Define the SourceDropdown functional component using the React.FC (FunctionComponent) type
const SourceDropdown: React.FC<SourceDropdownProps> = ({ sources, selectedSource, onSelectSource }) => {
  return (
    // A container div for the dropdown, styled with Tailwind CSS classes
    <div className='flex flex-col items-start'>
      {/* Label for the dropdown, with some margin at the bottom and bold font */}
      <label className='mb-2 font-semibold'>Sources:</label>
      {/* The select element which acts as the dropdown menu */}
      <select
        value={selectedSource} // Bind the value of the select element to the selectedSource prop
        onChange={e => onSelectSource(e.target.value)} // When the selected value changes, call the onSelectSource function with the new value
        title='Source' // Set a title attribute for accessibility
        className='w-full p-2 border border-gray-300 rounded text-black' // Apply some Tailwind CSS classes for styling
      >
        {/* The default option which represents selecting all sources */}
        <option value=''>All Sources</option>
        {/* Map over the sources array to create an option element for each source */}
        {sources.map((source, index) => (
          <option key={index} value={source}>
            {' '}
            {/*Create the options of the dropdown, mapping a key and the value when it's clicked */}
            {source} {/* Display the text associated to the value, in this case the same one */}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SourceDropdown; // Export the SourceDropdown component as the default export
