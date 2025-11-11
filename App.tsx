import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { DashboardCard } from './components/DashboardCard';
import { OverallParticipation } from './components/OverallParticipation';
import { GradeWiseParticipationChart } from './components/GradeWiseParticipationChart';
import { GapToGradeChart } from './components/GapToGradeChart';
import { StudentDetailsTable } from './components/StudentDetailsTable';
import { SchoolWisePerformanceTable } from './components/SchoolWisePerformanceTable';
import { districts, schools, grades, facts, studentDetails } from './data';
import type { DataFilters, School, GradeWiseParticipation, GapToGradeData, SchoolPerformance, StudentDetail } from './types';

const App: React.FC = () => {
  const [filters, setFilters] = useState<DataFilters>({
    selectedDistrict: 'all',
    selectedSchool: 'all',
    selectedGrade: 'all',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const {
    filteredSchools,
    totalRegistered,
    totalParticipated,
    gradeWiseParticipation,
    englishGapToGrade,
    mathGapToGrade,
    schoolPerformanceData,
    filteredStudentDetails,
  } = useMemo(() => {
    // Filter schools based on district for the dropdown
    let tempFilteredSchools: School[] = schools;
    const selectedDistrict = districts.find(d => d.district_name === filters.selectedDistrict);
    if (selectedDistrict) {
      tempFilteredSchools = schools.filter(s => s.district_id === selectedDistrict.district_id);
    }

    // Filter facts based on all filters
    let tempFilteredFacts = facts;
    if (selectedDistrict) {
      tempFilteredFacts = tempFilteredFacts.filter(f => f.district_id === selectedDistrict.district_id);
    }
    const selectedSchool = schools.find(s => s.school_name === filters.selectedSchool);
    if (selectedSchool) {
      tempFilteredFacts = tempFilteredFacts.filter(f => f.school_id === selectedSchool.school_id);
    }
    const selectedGrade = grades.find(g => g.grade_name === filters.selectedGrade);
    if (selectedGrade) {
      tempFilteredFacts = tempFilteredFacts.filter(f => f.grade_id === selectedGrade.grade_id);
    }

    // Filter student details
    let tempFilteredStudentDetails: StudentDetail[] = studentDetails;
     if (filters.selectedDistrict !== 'all') {
      tempFilteredStudentDetails = tempFilteredStudentDetails.filter(s => s.district === filters.selectedDistrict);
    }
    if (filters.selectedSchool !== 'all') {
      tempFilteredStudentDetails = tempFilteredStudentDetails.filter(s => s.schoolName === filters.selectedSchool);
    }
    if (filters.selectedGrade !== 'all') {
      tempFilteredStudentDetails = tempFilteredStudentDetails.filter(s => s.grade === filters.selectedGrade);
    }
    if (searchTerm) {
        tempFilteredStudentDetails = tempFilteredStudentDetails.filter(student =>
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.loginId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Calculate dashboard metrics from filtered facts
    const tempTotalRegistered = tempFilteredFacts.reduce((sum, f) => sum + f.registered, 0);
    const tempTotalParticipated = tempFilteredFacts.reduce((sum, f) => sum + f.participated, 0);

    // Calculate grade-wise participation
    const tempGradeWiseParticipation: GradeWiseParticipation[] = grades.map(grade => {
      const gradeFacts = tempFilteredFacts.filter(f => f.grade_id === grade.grade_id);
      return {
        grade: grade.grade_name,
        registered: gradeFacts.reduce((sum, f) => sum + f.registered, 0),
        participated: gradeFacts.reduce((sum, f) => sum + f.participated, 0),
      };
    }).filter(g => g.registered > 0 || g.participated > 0);

    // Calculate gap-to-grade data from filtered student details
    const processGapData = (levelField: 'englishLevel' | 'mathLevel'): GapToGradeData[] => {
      const levelCounts: { [key: string]: number } = {};
      tempFilteredStudentDetails.forEach(student => {
        const level = student[levelField] || 'N/A';
        levelCounts[level] = (levelCounts[level] || 0) + 1;
      });

      const levelOrder = ['At Level', 'Level 0', 'Level -1', 'Level -2', 'Level -3', 'Level -4'];
      const data: GapToGradeData[] = [];
      const presentLevels = new Set(Object.keys(levelCounts));

      levelOrder.forEach(level => {
        if (presentLevels.has(level)) {
          data.push({ name: level, Students: levelCounts[level] });
          presentLevels.delete(level);
        }
      });
      
      // Add any other levels that weren't in the predefined order
      presentLevels.forEach(level => {
        data.push({ name: level, Students: levelCounts[level] });
      });
      
      return data;
    };

    const tempEnglishGapToGrade = processGapData('englishLevel');
    const tempMathGapToGrade = processGapData('mathLevel');

    // School-wise performance from filtered facts
    const schoolMap = new Map<number, { schoolName: string; districtName: string; totalRegistered: number; totalParticipated: number }>();

    tempFilteredFacts.forEach(fact => {
      if (!schoolMap.has(fact.school_id)) {
        const school = schools.find(s => s.school_id === fact.school_id);
        const district = districts.find(d => d.district_id === fact.district_id);
        if(school && district) {
            schoolMap.set(fact.school_id, {
                schoolName: school.school_name,
                districtName: district.district_name,
                totalRegistered: 0,
                totalParticipated: 0,
            });
        }
      }
      const schoolData = schoolMap.get(fact.school_id);
      if(schoolData){
        schoolData.totalRegistered += fact.registered;
        schoolData.totalParticipated += fact.participated;
      }
    });

    const levelToScore = (level: string): number => {
        if (level === 'At Level' || level === 'Level 0') {
            return 0;
        }
        if (level.startsWith('Level ')) {
            const score = parseInt(level.replace('Level ', ''), 10);
            return isNaN(score) ? 0 : score;
        }
        return 0; // Default for unknown values like 'N/A' or empty strings
    };

    const tempSchoolPerformanceData: SchoolPerformance[] = Array.from(schoolMap.values()).map(data => {
      const schoolStudents = studentDetails.filter(s => s.schoolName === data.schoolName);
      
      let totalEnglishScore = 0;
      let totalMathScore = 0;

      if (schoolStudents.length > 0) {
        totalEnglishScore = schoolStudents.reduce((acc, student) => acc + levelToScore(student.englishLevel), 0);
        totalMathScore = schoolStudents.reduce((acc, student) => acc + levelToScore(student.mathLevel), 0);
      }
      
      const avgEnglishPerformance = schoolStudents.length > 0 ? totalEnglishScore / schoolStudents.length : 0;
      const avgMathPerformance = schoolStudents.length > 0 ? totalMathScore / schoolStudents.length : 0;
      
      return {
        ...data,
        participationRate: data.totalRegistered > 0 ? (data.totalParticipated / data.totalRegistered) * 100 : 0,
        avgEnglishPerformance,
        avgMathPerformance,
      };
    }).filter(d => d.totalRegistered > 0);


    return {
      filteredSchools: tempFilteredSchools,
      totalRegistered: tempTotalRegistered,
      totalParticipated: tempTotalParticipated,
      gradeWiseParticipation: tempGradeWiseParticipation,
      englishGapToGrade: tempEnglishGapToGrade,
      mathGapToGrade: tempMathGapToGrade,
      schoolPerformanceData: tempSchoolPerformanceData,
      filteredStudentDetails: tempFilteredStudentDetails,
    };
  }, [filters, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="space-y-6">
            <FilterBar
              districts={districts}
              grades={grades}
              filters={filters}
              onFilterChange={setFilters}
              filteredSchools={filteredSchools}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Total Schools" value={(filters.selectedSchool !== 'all' ? 1 : filteredSchools.length).toString()} />
                <DashboardCard title="Total Students" value={totalRegistered.toLocaleString()} />
                <DashboardCard title="Students Participated" value={totalParticipated.toLocaleString()} />
                <DashboardCard title="Overall Participation" value={`${(totalRegistered > 0 ? (totalParticipated/totalRegistered) * 100 : 0).toFixed(1)}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <OverallParticipation total={totalRegistered} participated={totalParticipated} />
                </div>
                <div className="lg:col-span-2">
                    <GradeWiseParticipationChart data={gradeWiseParticipation} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GapToGradeChart title="English - Gap to Grade Level" data={englishGapToGrade} />
                <GapToGradeChart title="Math - Gap to Grade Level" data={mathGapToGrade} />
            </div>

            <SchoolWisePerformanceTable schools={schoolPerformanceData} />

            <StudentDetailsTable students={filteredStudentDetails} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;