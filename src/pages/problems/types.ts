// src/types.ts
export interface Users {
    problemList: ProblemList[];
    // Add other user properties as needed
  }
  
  export interface ProblemList {
    _id: string;
    solved: boolean;
    // Add other problem properties as needed
  }
  
  export interface Problem {
    _id: string;
    id: string;
    order: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    videoId: string;
    // Add other problem properties as needed
  }