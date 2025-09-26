
import React, { useState } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { useJobs } from '../contexts/JobContext';
import type { JobStatus } from '../contexts/JobContext';
import JobDetailsModal from '../components/JobDetailsModal';

const JobsOverview: React.FC = () => {
  const { state, getFilteredJobs, setActiveFilter, getJobById } = useJobs();
  const { activeFilter, loading } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const jobs = getFilteredJobs();
  const selectedJob = selectedJobId ? getJobById(selectedJobId) : null;

  const handleTabClick = (filter: JobStatus) => {
    setActiveFilter(filter);
  };

  const handleViewDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div className="content-area">
      <Header />
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="glass-card p-6 rounded-xl border-t-2 border-orange">
          <h2 className="text-4xl font-extrabold text-white mb-2">{jobs.length}</h2>
          <p className="text-sm text-text-secondary">Total Bookings</p>
        </div>
        <div className="glass-card p-6 rounded-xl border-t-2 border-green">
          <h2 className="text-4xl font-extrabold text-green mb-2">{jobs.filter(j => j.status === 'completed').length}</h2>
          <p className="text-sm text-text-secondary">Completed</p>
        </div>
      </div>

      {/* Tab Container */}
      <div className="glass-card p-1 rounded-md mb-6 flex items-center">
        <button 
          onClick={() => handleTabClick('available')} 
          className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-all duration-300 ${activeFilter === 'available' ? 'bg-purple text-white shadow-purple-glow' : 'text-text-secondary'}`}>
          Available
        </button>
        <button 
          onClick={() => handleTabClick('scheduled')} 
          className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-all duration-300 ${activeFilter === 'scheduled' ? 'bg-purple text-white shadow-purple-glow' : 'text-text-secondary'}`}>
          Scheduled
        </button>
        <button 
          onClick={() => handleTabClick('completed')} 
          className={`flex-1 py-3 px-4 rounded text-sm font-semibold transition-all duration-300 ${activeFilter === 'completed' ? 'bg-purple text-white shadow-purple-glow' : 'text-text-secondary'}`}>
          Completed
        </button>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {loading && <p className="text-center text-text-secondary">Loading jobs...</p>}
        {!loading && jobs.length === 0 && <p className="text-center text-text-secondary">No jobs in this category.</p>}
        {!loading && jobs.map(job => <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} />)}
      </div>

      {selectedJob && (
        <JobDetailsModal 
          job={selectedJob} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default JobsOverview;
