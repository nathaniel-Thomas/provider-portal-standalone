
export interface Job {
  id: string;
  serviceType: string;
  customer: {
    name: string;
    location: string;
  };
  price: number;
  tip?: number;
  access: string;
  timeEstimate: string;
  status: 'available' | 'scheduled' | 'completed';
  dateTime?: string;
  isUrgent?: boolean;
  distance?: string;
  duration?: string;
  earnings?: number;
}

export const availableJobs: Job[] = [
  {
    id: '1',
    serviceType: 'Deep Clean',
    customer: {
      name: 'John Doe',
      location: '123 Main St, Anytown, USA',
    },
    price: 150,
    tip: 25,
    access: 'Key under mat',
    timeEstimate: '3 hours',
    status: 'available',
    dateTime: 'Today at 4:00 PM',
    isUrgent: true,
    distance: '2.5 mi',
  },
  {
    id: '2',
    serviceType: 'Standard Clean',
    customer: {
      name: 'Jane Smith',
      location: '456 Oak Ave, Anytown, USA',
    },
    price: 80,
    access: 'Door code: 1234',
    timeEstimate: '1.5 hours',
    status: 'available',
    dateTime: 'Tomorrow at 2:30 PM',
    distance: '5.1 mi',
  },
];

export const scheduledJobs: Job[] = [
  {
    id: '3',
    serviceType: 'Move-out Clean',
    customer: {
      name: 'Emily Johnson',
      location: '789 Pine Ln, Anytown, USA',
    },
    price: 250,
    status: 'scheduled',
    dateTime: 'Tomorrow at 10:00 AM',
  },
];

export const completedJobs: Job[] = [
  {
    id: '4',
    serviceType: 'Window Cleaning',
    customer: {
      name: 'Michael Brown',
      location: '101 Maple Dr, Anytown, USA',
    },
    price: 120,
    status: 'completed',
    duration: '2h 15m',
    earnings: 140, // includes tip
  },
];

export const earningsSummary = {
  totalEarnings: 23450,
  jobsCompleted: 152,
  avgPerJob: 154.28,
  monthlyEarnings: 3850,
};

export const userProfile = {
  name: 'Alex Farr',
  title: 'Pro Cleaner',
  avatarInitials: 'AF',
  verified: true,
  jobsCompleted: 152,
  rating: 4.9,
  memberSince: '2023',
  monthlyEarnings: 3850,
};

export const expensesData = {
  totalExpenses: 1245.50,
  deductibleExpenses: 980.00,
  items: [
    { id: '1', category: 'Fuel', description: 'Shell Gas Station', date: '2025-10-20', amount: 65.50, isDeductible: true },
    { id: '2', category: 'Supplies', description: 'Cleaning Solutions', date: '2025-10-18', amount: 120.00, isDeductible: true },
    { id: '3', category: 'Equipment', description: 'New Vacuum Cleaner', date: '2025-10-15', amount: 350.00, isDeductible: true },
    { id: '4', category: 'Marketing', description: 'Business Cards', date: '2025-10-10', amount: 50.00, isDeductible: true },
    { id: '5', category: 'Other', description: 'Lunch', date: '2025-10-20', amount: 15.00, isDeductible: false },
  ]
};

export const payoutsData = {
  bankAccount: {
    bankName: 'Chase Bank',
    accountNumber: '**** **** **** 1234',
  },
  history: [
    { id: '1', date: '2025-10-17', amount: 850.00, status: 'Paid' },
    { id: '2', date: '2025-10-10', amount: 720.50, status: 'Paid' },
    { id: '3', date: '2025-10-03', amount: 910.00, status: 'Paid' },
    { id: '4', date: '2025-09-26', amount: 680.75, status: 'Paid' },
  ]
};

export const taxData = {
  summary: {
    grossIncome: 23450,
    expenses: 1245.50,
    taxableIncome: 22204.50,
    estimatedTaxesOwed: 5551.13,
  },
  documents: [
    { id: '1', name: '2024 Form 1099-K', type: '1099' },
    { id: '2', name: '2024 Tax Summary', type: 'Summary' },
    { id: '3', name: '2023 Form 1099-K', type: '1099' },
  ]
};
