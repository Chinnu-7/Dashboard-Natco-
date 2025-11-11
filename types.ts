export interface District {
  district_id: number;
  district_name: string;
}

export interface School {
  school_id: number;
  school_name: string;
  district_id: number;
}

export interface Grade {
  grade_id: number;
  grade_name: string;
}

export interface Fact {
  district_id: number;
  school_id: number;
  grade_id: number;
  registered: number;
  participated: number;
}

export interface StudentDetail {
  district: string;
  schoolId: string;
  schoolName: string;
  loginId: string;
  studentName: string;
  grade: string;
  englishLevel: string;
  mathLevel: string;
}

export interface DataFilters {
  selectedDistrict: string;
  selectedSchool: string;
  selectedGrade: string;
}

export interface GradeWiseParticipation {
  grade: string;
  registered: number;
  participated: number;
}

export interface GapToGradeData {
  name: string;
  Students: number;
}

export interface SchoolPerformance {
    schoolName: string;
    districtName: string;
    totalRegistered: number;
    totalParticipated: number;
    participationRate: number;
    avgEnglishPerformance: number;
    avgMathPerformance: number;
}