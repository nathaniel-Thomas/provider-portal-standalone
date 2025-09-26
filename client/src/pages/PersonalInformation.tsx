
import React from 'react';
import SettingsPage from '../components/SettingsPage';
import { userProfile } from '../utils/seedData';

const FormField = ({ label, value, type = 'text' }) => (
  <div>
    <label className="text-xs text-text-secondary mb-2 block">{label}</label>
    <input 
      type={type} 
      defaultValue={value} 
      className="w-full bg-[rgba(255,255,255,0.05)] border border-card-border rounded-md px-3 py-2 text-sm text-white focus:ring-purple focus:border-purple"
    />
  </div>
);

const PersonalInformation: React.FC = () => {
  return (
    <SettingsPage title="Personal Information">
      <div className="space-y-6">
        {/* Basic Information Card */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First Name" value="Alex" />
              <FormField label="Last Name" value="Farr" />
            </div>
            <FormField label="Email Address" value="alex.farr@example.com" type="email" />
            <FormField label="Phone Number" value="+1 (555) 123-4567" type="tel" />
          </div>
        </div>

        {/* Address Card */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-bold text-white mb-4">Address</h3>
          <div className="space-y-4">
            <FormField label="Street Address" value="123 Main St" />
            <FormField label="Apartment, suite, etc." value="Apt 4B" />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="City" value="Anytown" />
              <FormField label="State" value="CA" />
            </div>
            <FormField label="ZIP Code" value="12345" />
          </div>
        </div>

        <button className="w-full bg-purple text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-purple-glow">
          Save Changes
        </button>
      </div>
    </SettingsPage>
  );
};

export default PersonalInformation;
