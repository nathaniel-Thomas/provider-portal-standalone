import { ArrowLeft, Upload, Check, X, Clock, AlertTriangle, FileText, Shield, User, CreditCard, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface ProviderOnboardingProps {
  onBack: () => void;
}

interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  uploadDate?: Date;
  expiryDate?: Date;
  rejectionReason?: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  active: boolean;
  requirements: DocumentRequirement[];
}

export default function ProviderOnboarding({ onBack }: ProviderOnboardingProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Upload your government-issued ID',
      icon: User,
      completed: true,
      active: false,
      requirements: [
        {
          id: 'drivers-license',
          title: "Driver's License",
          description: 'Clear photo of front and back',
          icon: FileText,
          required: true,
          status: 'approved',
          uploadDate: new Date(2024, 9, 15),
          expiryDate: new Date(2027, 9, 15)
        }
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance Coverage',
      description: 'Upload proof of liability insurance',
      icon: Shield,
      completed: false,
      active: true,
      requirements: [
        {
          id: 'liability-insurance',
          title: 'Liability Insurance',
          description: 'Minimum $1M coverage required',
          icon: Shield,
          required: true,
          status: 'uploaded',
          uploadDate: new Date(2024, 9, 20)
        },
        {
          id: 'vehicle-insurance',
          title: 'Auto Insurance',
          description: 'Current vehicle insurance policy',
          icon: CreditCard,
          required: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'background',
      title: 'Background Check',
      description: 'Complete background verification',
      icon: Shield,
      completed: false,
      active: false,
      requirements: [
        {
          id: 'background-check',
          title: 'Background Check',
          description: 'Automated verification in progress',
          icon: Shield,
          required: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'tax',
      title: 'Tax Information',
      description: 'Provide tax documentation',
      icon: FileText,
      completed: false,
      active: false,
      requirements: [
        {
          id: 'w9-form',
          title: 'W-9 Tax Form',
          description: 'Required for 1099 reporting',
          icon: FileText,
          required: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'contract',
      title: 'Service Agreement',
      description: 'Review and sign contractor agreement',
      icon: FileText,
      completed: false,
      active: false,
      requirements: [
        {
          id: 'contractor-agreement',
          title: 'Independent Contractor Agreement',
          description: 'Digital signature required',
          icon: FileText,
          required: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'training',
      title: 'Training Completion',
      description: 'Complete required training modules',
      icon: BookOpen,
      completed: false,
      active: false,
      requirements: [
        {
          id: 'safety-training',
          title: 'Safety Training',
          description: '45-minute online course',
          icon: BookOpen,
          required: true,
          status: 'pending'
        },
        {
          id: 'service-training',
          title: 'Service Standards Training',
          description: '30-minute quality standards course',
          icon: BookOpen,
          required: true,
          status: 'pending'
        }
      ]
    }
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const totalSteps = onboardingSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-success-green" />;
      case 'uploaded':
        return <Clock className="h-4 w-4 text-warning-orange" />;
      case 'rejected':
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Upload className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-green/20 text-success-green">Approved</Badge>;
      case 'uploaded':
        return <Badge className="bg-warning-orange/20 text-warning-orange">Under Review</Badge>;
      case 'rejected':
        return <Badge className="bg-error-red/20 text-destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-text-secondary/20 text-muted-foreground">Pending</Badge>;
    }
  };

  const handleFileUpload = async (docId: string, file: File) => {
    setUploadingDoc(docId);

    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Uploaded ${file.name} for document ${docId}`);
    setUploadingDoc(null);
    setSelectedFile(null);
  };

  const handleContractSign = () => {
    console.log('Contract signed digitally');
    setContractAccepted(true);
  };

  const canProceedToJobs = completedSteps === totalSteps;

  return (
    <div className="pb-5 relative" data-testid="screen-provider-onboarding">
      <main className="pt-[44px] px-5">
        {/* Header */}
        <header className="bg-background-dark p-5 flex items-center justify-between fixed top-0 left-0 right-0 z-10 max-w-mobile mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2 text-white -ml-2"
            data-testid="back-button"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Provider Onboarding</h1>
          <div className="w-10 h-10" />
        </header>

        {/* Progress Overview */}
        <section className="mt-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Onboarding Progress</h2>
                  <p className="text-sm text-muted-foreground">
                    {completedSteps} of {totalSteps} steps completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(progressPercentage)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>

              <Progress value={progressPercentage} className="h-2 mb-4" />

              {canProceedToJobs ? (
                <div className="bg-success-green/20 border border-success-green/30 rounded-lg p-4 flex items-center gap-3">
                  <Check className="h-6 w-6 text-success-green" />
                  <div>
                    <p className="font-semibold text-success-green">Ready to Start!</p>
                    <p className="text-sm text-success-green/80">You can now accept job assignments</p>
                  </div>
                </div>
              ) : (
                <div className="bg-warning-orange/20 border border-warning-orange/30 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-warning-orange" />
                  <div>
                    <p className="font-semibold text-warning-orange">Onboarding Required</p>
                    <p className="text-sm text-warning-orange/80">Complete all steps to access jobs</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Onboarding Steps */}
        <section className="mt-6 space-y-4">
          {onboardingSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.id}
                className={`bg-card border-2 transition-colors ${
                  step.completed ? 'border-success-green/30' :
                  step.active ? 'border-primary/50' :
                  'border-border'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-success-green/20' :
                      step.active ? 'bg-primary/20' :
                      'bg-muted'
                    }`}>
                      {step.completed ?
                        <Check className="h-5 w-5 text-success-green" /> :
                        <Icon className={`h-5 w-5 ${step.active ? 'text-primary' : 'text-muted-foreground'}`} />
                      }
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>

                  {/* Document Requirements */}
                  <div className="space-y-3">
                    {step.requirements.map((doc) => (
                      <div
                        key={doc.id}
                        className="bg-muted rounded-lg p-4 border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(doc.status)}
                            <div>
                              <p className="font-medium text-sm">{doc.title}</p>
                              <p className="text-xs text-muted-foreground">{doc.description}</p>
                            </div>
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>

                        {/* Upload Section */}
                        {(doc.status === 'pending' || doc.status === 'rejected') && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setSelectedFile(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                              id={`file-${doc.id}`}
                            />
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`file-${doc.id}`}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="bg-muted hover:bg-muted/80 rounded-lg p-3 text-center border-2 border-dashed border-muted-foreground/30">
                                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    Click to upload or drag file here
                                  </p>
                                  <p className="text-xs text-muted-foreground/70 mt-1">
                                    Supports: JPG, PNG, PDF (Max 10MB)
                                  </p>
                                </div>
                              </label>
                            </div>

                            {selectedFile && (
                              <div className="mt-3 p-3 bg-primary/10 rounded-lg flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{selectedFile.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleFileUpload(doc.id, selectedFile)}
                                  disabled={uploadingDoc === doc.id}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  {uploadingDoc === doc.id ? 'Uploading...' : 'Upload'}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Contract Signing Section */}
                        {doc.id === 'contractor-agreement' && doc.status === 'pending' && (
                          <div className="mt-3 pt-3 border-t border-border space-y-3">
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => console.log('View contract')}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Review Contract Terms
                            </Button>

                            <div className="flex items-start gap-3">
                              <Checkbox
                                id="contract-terms"
                                checked={contractAccepted}
                                onCheckedChange={(checked) => setContractAccepted(checked as boolean)}
                              />
                              <label htmlFor="contract-terms" className="text-sm text-muted-foreground cursor-pointer">
                                I have read and agree to the Independent Contractor Agreement terms and conditions
                              </label>
                            </div>

                            <Button
                              className="w-full bg-primary hover:bg-primary/90"
                              disabled={!contractAccepted}
                              onClick={handleContractSign}
                            >
                              Sign Agreement Digitally
                            </Button>
                          </div>
                        )}

                        {/* Training Section */}
                        {doc.icon === BookOpen && doc.status === 'pending' && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Button
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={() => console.log(`Start training: ${doc.id}`)}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Start Training Module
                            </Button>
                          </div>
                        )}

                        {/* Status Information */}
                        {doc.status === 'uploaded' && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-warning-orange">
                              ⏱️ Under review - typically takes 1-2 business days
                            </p>
                          </div>
                        )}

                        {doc.status === 'approved' && doc.expiryDate && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-success-green">
                              ✅ Approved - Valid until {doc.expiryDate.toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {doc.status === 'rejected' && doc.rejectionReason && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-destructive">
                              ❌ {doc.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Actions */}
        <section className="mt-6 pb-6">
          {canProceedToJobs && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-success-green to-success-green/80 text-white font-semibold"
              onClick={() => console.log('Navigate to job dashboard')}
            >
              Start Accepting Jobs
            </Button>
          )}

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => console.log('Contact support')}
            >
              Need help? Contact Support
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}