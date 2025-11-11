import React from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import type { District, School, Grade, DataFilters } from '../types';

interface FilterBarProps {
  districts: District[];
  grades: Grade[];
  filters: DataFilters;
  onFilterChange: (filters: DataFilters) => void;
  filteredSchools: School[];
}

const SelectInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: {value: string; label: string}[] }> = ({ label, value, onChange, options }) => (
    <div className="w-full">
        <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select
                id={label}
                name={label}
                value={value}
                onChange={onChange}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-700 shadow-sm focus:outline-none focus:ring-brand-dark focus:border-brand-dark sm:text-sm"
            >
                {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-4 w-4" />
            </div>
        </div>
    </div>
);


export const FilterBar: React.FC<FilterBarProps> = ({ districts, grades, filters, onFilterChange, filteredSchools }) => {
    
    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, selectedDistrict: e.target.value, selectedSchool: 'all' });
    };

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, selectedSchool: e.target.value });
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({ ...filters, selectedGrade: e.target.value });
    };

    const districtOptions = [{value: 'all', label: 'All Districts'}, ...districts.map(d => ({ value: d.district_name, label: d.district_name }))];
    const schoolOptions = [{value: 'all', label: 'All Schools'}, ...filteredSchools.map(s => ({ value: s.school_name, label: s.school_name }))];
    const gradeOptions = [{value: 'all', label: 'All Grades'}, ...grades.map(g => ({ value: g.grade_name, label: g.grade_name }))];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto flex-grow">
                <SelectInput label="Select District" value={filters.selectedDistrict} onChange={handleDistrictChange} options={districtOptions} />
                <SelectInput label="Select School" value={filters.selectedSchool} onChange={handleSchoolChange} options={schoolOptions} />
                <SelectInput label="Select Grade Level" value={filters.selectedGrade} onChange={handleGradeChange} options={gradeOptions} />
            </div>
            <button className="w-full md:w-auto bg-brand-dark hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out">
                Upload Data
            </button>
        </div>
    );
};
