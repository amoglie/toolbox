export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
  sectionId?: string;
}

export interface Section {
  id: string;
  title: string;
  tasks: Task[];
  isExpanded?: boolean;
}

