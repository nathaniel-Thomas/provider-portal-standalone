import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Camera,
  X,
  Check,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  Signature,
  Play,
  Square,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { Job } from '../../../shared/schema';

interface QualityControlDocumentationProps {
  job: Job;
  onUpdateDocumentation: (updates: Partial<Job['documentation']>) => void;
  onComplete: () => void;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  task: string;
  required: boolean;
  completed: boolean;
  notes?: string;
}

interface PhotoRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  photos: string[];
  maxPhotos: number;
}

interface GPSLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export default function QualityControlDocumentation({
  job,
  onUpdateDocumentation,
  onComplete,
  onClose
}: QualityControlDocumentationProps) {
  const [currentStep, setCurrentStep] = useState<'checklist' | 'photos' | 'signature' | 'review'>('checklist');
  const [isTimerRunning, setIsTimerRunning] = useState(job.inProgress || false);
  const [startTime] = useState(job.startedAt ? new Date(job.startedAt) : new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [providerNotes, setProviderNotes] = useState(job.documentation?.providerNotes || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Service-specific checklist items
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: 'arrival-verification',
      task: 'Verified arrival at correct address',
      required: true,
      completed: false
    },
    {
      id: 'customer-contact',
      task: 'Made contact with customer or confirmed access',
      required: true,
      completed: false
    },
    {
      id: 'area-assessment',
      task: 'Assessed work area and took before photos',
      required: true,
      completed: false
    },
    {
      id: 'supplies-check',
      task: 'Verified all necessary supplies are available',
      required: true,
      completed: false
    },
    {
      id: 'safety-protocols',
      task: 'Followed safety protocols and guidelines',
      required: true,
      completed: false
    },
    {
      id: 'quality-standards',
      task: 'Completed work to company quality standards',
      required: true,
      completed: false
    },
    {
      id: 'area-cleanup',
      task: 'Cleaned and restored work area',
      required: true,
      completed: false
    },
    {
      id: 'final-inspection',
      task: 'Completed final quality inspection',
      required: true,
      completed: false
    }
  ]);

  // Photo requirements based on service type
  const [photoRequirements, setPhotoRequirements] = useState<PhotoRequirement[]>([
    {
      id: 'before-photos',
      title: 'Before Photos',
      description: 'Take photos of areas to be cleaned before starting work',
      required: true,
      photos: [],
      maxPhotos: 5
    },
    {
      id: 'in-progress-photos',
      title: 'Work in Progress',
      description: 'Document your work process (optional but recommended)',
      required: false,
      photos: [],
      maxPhotos: 3
    },
    {
      id: 'after-photos',
      title: 'After Photos',
      description: 'Take photos of completed work from same angles as before photos',
      required: true,
      photos: [],
      maxPhotos: 5
    },
    {
      id: 'issue-photos',
      title: 'Issues/Damage',
      description: 'Document any pre-existing damage or issues found',
      required: false,
      photos: [],
      maxPhotos: 3
    }
  ]);

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Time tracking
  const startTimer = () => {
    setIsTimerRunning(true);
    getCurrentLocation();
    onUpdateDocumentation({
      startedAt: new Date(),
      startLocation: currentLocation || undefined
    });
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    const endTime = new Date();
    const totalTime = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // minutes

    getCurrentLocation();
    onUpdateDocumentation({
      completedAt: endTime,
      totalTimeSpent: totalTime,
      endLocation: currentLocation || undefined
    });
  };

  // Checklist management
  const toggleChecklistItem = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const updateChecklistNotes = (id: string, notes: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Photo management
  const handlePhotoUpload = (requirementId: string, files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoRequirements(reqs =>
          reqs.map(req =>
            req.id === requirementId
              ? { ...req, photos: [...req.photos, e.target?.result as string].slice(0, req.maxPhotos) }
              : req
          )
        );
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (requirementId: string, photoIndex: number) => {
    setPhotoRequirements(reqs =>
      reqs.map(req =>
        req.id === requirementId
          ? { ...req, photos: req.photos.filter((_, index) => index !== photoIndex) }
          : req
      )
    );
  };

  // Digital signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (e.buttons === 1) { // Left mouse button is pressed
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    setSignatureData(dataURL);
  };

  // Progress calculation
  const completedChecklist = checklistItems.filter(item => item.completed).length;
  const requiredPhotos = photoRequirements.filter(req => req.required);
  const completedPhotos = requiredPhotos.filter(req => req.photos.length > 0).length;
  const hasSignature = signatureData !== null;

  const totalSteps = checklistItems.length + requiredPhotos.length + 1; // +1 for signature
  const completedSteps = completedChecklist + completedPhotos + (hasSignature ? 1 : 0);
  const progress = (completedSteps / totalSteps) * 100;

  const canComplete =
    checklistItems.every(item => !item.required || item.completed) &&
    requiredPhotos.every(req => req.photos.length > 0) &&
    hasSignature &&
    customerName.trim() !== '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-muted rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-muted p-6 border-b border-border rounded-t-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Quality Control Documentation</h2>
              <p className="text-sm text-muted-foreground">{job.serviceType} - {job.customerName}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Documentation Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Time Tracking */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {isTimerRunning ? 'Work in Progress' : 'Ready to Start'}
                    </span>
                  </div>
                  {currentLocation && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-success-green" />
                      <span className="text-xs text-success-green">GPS Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                  </span>
                  {!isTimerRunning ? (
                    <Button size="sm" onClick={startTimer} className="bg-success-green hover:bg-success-green/90">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={stopTimer}>
                      <Square className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Navigation */}
          <div className="flex gap-2 mt-4">
            {['checklist', 'photos', 'signature', 'review'].map((step) => (
              <Button
                key={step}
                variant={currentStep === step ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep(step as any)}
                className="flex-1 text-xs"
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Service Checklist */}
          {currentStep === 'checklist' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Completion Checklist</h3>
              <p className="text-sm text-muted-foreground">
                Complete all required tasks to ensure quality standards are met.
              </p>

              {checklistItems.map((item) => (
                <Card key={item.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.completed}
                        onCheckedChange={() => toggleChecklistItem(item.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {item.task}
                          </p>
                          {item.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>

                        <Textarea
                          placeholder="Add notes (optional)..."
                          value={item.notes || ''}
                          onChange={(e) => updateChecklistNotes(item.id, e.target.value)}
                          className="mt-2 text-xs"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between">
                <div />
                <Button onClick={() => setCurrentStep('photos')}>
                  Next: Photo Documentation
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Photo Documentation */}
          {currentStep === 'photos' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Photo Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Document your work with before and after photos to ensure quality standards.
              </p>

              {photoRequirements.map((requirement) => (
                <Card key={requirement.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-medium">{requirement.title}</h4>
                      {requirement.required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {requirement.photos.length}/{requirement.maxPhotos}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {requirement.description}
                    </p>

                    {/* Photo Upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files) {
                          handlePhotoUpload(requirement.id, e.target.files);
                        }
                      }}
                    />

                    {requirement.photos.length < requirement.maxPhotos && (
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full mb-3"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    )}

                    {/* Photo Grid */}
                    {requirement.photos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {requirement.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`${requirement.title} ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removePhoto(requirement.id, index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('checklist')}>
                  Back: Checklist
                </Button>
                <Button onClick={() => setCurrentStep('signature')}>
                  Next: Customer Signature
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Digital Signature */}
          {currentStep === 'signature' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Signature</h3>
              <p className="text-sm text-muted-foreground">
                Collect customer signature to confirm work completion and satisfaction.
              </p>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer's full name"
                      className="w-full p-2 bg-muted border border-border rounded-lg text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">Digital Signature</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={150}
                        className="w-full border border-border rounded cursor-crosshair"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={saveSignature}
                      />
                      <div className="flex justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          Sign above to confirm work completion
                        </p>
                        <Button variant="outline" size="sm" onClick={clearSignature}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('photos')}>
                  Back: Photos
                </Button>
                <Button
                  onClick={() => setCurrentStep('review')}
                  disabled={!customerName.trim() || !signatureData}
                >
                  Next: Review & Complete
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Complete */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review & Complete Job</h3>
              <p className="text-sm text-muted-foreground">
                Review all documentation before submitting the completed job.
              </p>

              {/* Summary Cards */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success-green" />
                    Completion Summary
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Checklist Items</p>
                      <p className="font-medium">{completedChecklist}/{checklistItems.length} Completed</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Required Photos</p>
                      <p className="font-medium">{completedPhotos}/{requiredPhotos.length} Completed</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Customer Signature</p>
                      <p className="font-medium">{hasSignature ? 'Collected' : 'Missing'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Work Duration</p>
                      <p className="font-medium">{Math.floor(elapsedTime / 60)}h {elapsedTime % 60}m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Notes */}
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Provider Notes</h4>
                  <Textarea
                    placeholder="Add any additional notes about the service, customer feedback, or issues encountered..."
                    value={providerNotes}
                    onChange={(e) => setProviderNotes(e.target.value)}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Validation Issues */}
              {!canComplete && (
                <Card className="bg-destructive/10 border-destructive/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <h4 className="font-medium text-destructive">Incomplete Documentation</h4>
                    </div>
                    <ul className="text-sm text-destructive/80 space-y-1">
                      {checklistItems.filter(item => item.required && !item.completed).length > 0 && (
                        <li>• Complete all required checklist items</li>
                      )}
                      {requiredPhotos.filter(req => req.photos.length === 0).length > 0 && (
                        <li>• Upload all required photos</li>
                      )}
                      {!hasSignature && <li>• Collect customer signature</li>}
                      {!customerName.trim() && <li>• Enter customer name</li>}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('signature')}>
                  Back: Signature
                </Button>
                <Button
                  onClick={() => {
                    onUpdateDocumentation({
                      photos: photoRequirements.flatMap(req =>
                        req.photos.map(url => ({
                          id: Date.now().toString() + Math.random(),
                          url,
                          room: req.title,
                          type: req.title.toLowerCase().includes('before') ? 'before' : 'after',
                          timestamp: new Date(),
                          caption: req.description
                        }))
                      ),
                      checklistItems: checklistItems.map(item => ({
                        id: item.id,
                        room: 'General',
                        task: item.task,
                        completed: item.completed,
                        notes: item.notes
                      })),
                      customerSignature: signatureData || undefined,
                      customerName: customerName,
                      providerNotes: providerNotes,
                      completedAt: new Date(),
                      totalTimeSpent: elapsedTime
                    });
                    onComplete();
                  }}
                  disabled={!canComplete}
                  className="bg-success-green hover:bg-success-green/90"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Job
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}