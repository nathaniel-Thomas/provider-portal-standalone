import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Upload, CheckCircle, Circle, X, Plus } from 'lucide-react';
import { Job, Photo, ChecklistItem } from '../../../shared/schema';

interface ServiceDocumentationProps {
  job: Job;
  onUpdateDocumentation: (updates: Partial<Job['documentation']>) => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function ServiceDocumentation({
  job,
  onUpdateDocumentation,
  onComplete,
  onClose
}: ServiceDocumentationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('Kitchen');
  const [photoType, setPhotoType] = useState<'before' | 'after'>('before');
  const [notes, setNotes] = useState(job.documentation?.providerNotes || '');
  
  // Get unique rooms from checklist
  const roomSet = new Set(
    job.documentation?.checklistItems?.map(item => item.room) || ['Kitchen', 'Bathroom', 'Living Room', 'Bedroom']
  );
  const rooms = Array.from(roomSet);
  
  // Group checklist items by room
  const checklistByRoom = (job.documentation?.checklistItems || []).reduce((acc, item) => {
    if (!acc[item.room]) acc[item.room] = [];
    acc[item.room].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);
  
  // Group photos by room
  const photosByRoom = (job.documentation?.photos || []).reduce((acc, photo) => {
    if (!acc[photo.room]) acc[photo.room] = [];
    acc[photo.room].push(photo);
    return acc;
  }, {} as Record<string, Photo[]>);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const newPhoto: Photo = {
            id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: dataUrl,
            room: selectedRoom,
            type: photoType,
            timestamp: new Date(),
            caption: `${photoType === 'before' ? 'Before' : 'After'} cleaning - ${selectedRoom}`
          };
          
          const existingPhotos = job.documentation?.photos || [];
          onUpdateDocumentation({
            photos: [...existingPhotos, newPhoto]
          });
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChecklistToggle = (itemId: string, completed: boolean) => {
    const existingItems = job.documentation?.checklistItems || [];
    const updatedItems = existingItems.map(item => 
      item.id === itemId ? { ...item, completed } : item
    );
    
    onUpdateDocumentation({
      checklistItems: updatedItems
    });
  };

  const handleChecklistNotes = (itemId: string, notes: string) => {
    const existingItems = job.documentation?.checklistItems || [];
    const updatedItems = existingItems.map(item => 
      item.id === itemId ? { ...item, notes } : item
    );
    
    onUpdateDocumentation({
      checklistItems: updatedItems
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    const existingPhotos = job.documentation?.photos || [];
    const updatedPhotos = existingPhotos.filter(photo => photo.id !== photoId);
    
    onUpdateDocumentation({
      photos: updatedPhotos
    });
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onUpdateDocumentation({
      providerNotes: newNotes
    });
  };

  const completedTasks = job.documentation?.checklistItems?.filter(item => item.completed).length || 0;
  const totalTasks = job.documentation?.checklistItems?.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isReadyToComplete = completionRate >= 80; // Need at least 80% completion

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-muted rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-muted p-6 border-b border-border rounded-t-2xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Service Documentation</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {job.serviceType} • {job.location.street}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              data-testid="button-close-documentation"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={completionRate >= 80 ? "default" : "secondary"}>
              {completedTasks}/{totalTasks} tasks completed ({completionRate}%)
            </Badge>
            <Badge variant={job.documentation?.photos?.length ? "default" : "secondary"}>
              {job.documentation?.photos?.length || 0} photos uploaded
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Selection & Photo Upload */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {rooms.map(room => (
                  <Button
                    key={room}
                    variant={selectedRoom === room ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRoom(room)}
                    data-testid={`button-room-${room.toLowerCase().replace(' ', '-')}`}
                  >
                    {room}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={photoType === 'before' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPhotoType('before')}
                  data-testid="button-photo-before"
                >
                  Before
                </Button>
                <Button
                  variant={photoType === 'after' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPhotoType('after')}
                  data-testid="button-photo-after"
                >
                  After
                </Button>
              </div>

              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-photo-upload"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                  data-testid="button-upload-photo"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {photoType} photos for {selectedRoom}
                </Button>
              </div>

              {/* Photos by Room */}
              {rooms.map(room => {
                const roomPhotos = photosByRoom[room] || [];
                if (roomPhotos.length === 0) return null;
                
                return (
                  <div key={room} className="space-y-2">
                    <h4 className="font-medium text-sm">{room} Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {roomPhotos.map(photo => (
                        <div 
                          key={photo.id} 
                          className="relative group bg-background rounded-lg overflow-hidden"
                          data-testid={`photo-${photo.id}`}
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption}
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute top-1 left-1">
                            <Badge variant={photo.type === 'before' ? "secondary" : "default"} className="text-xs">
                              {photo.type}
                            </Badge>
                          </div>
                          <button
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-remove-photo-${photo.id}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Room-based Checklists */}
          {rooms.map(room => {
            const roomTasks = checklistByRoom[room] || [];
            if (roomTasks.length === 0) return null;
            
            const completedRoomTasks = roomTasks.filter(task => task.completed).length;
            
            return (
              <Card key={room} className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {room} Tasks
                    </CardTitle>
                    <Badge variant={completedRoomTasks === roomTasks.length ? "default" : "secondary"}>
                      {completedRoomTasks}/{roomTasks.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {roomTasks.map(task => (
                    <div key={task.id} className="space-y-2" data-testid={`task-${task.id}`}>
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) => handleChecklistToggle(task.id, !!checked)}
                          className="mt-1"
                          data-testid={`checkbox-task-${task.id}`}
                        />
                        <div className="flex-1">
                          <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.task}
                          </p>
                          {task.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{task.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Add notes for this task..."
                        value={task.notes || ''}
                        onChange={(e) => handleChecklistNotes(task.id, e.target.value)}
                        className="text-xs min-h-[60px]"
                        data-testid={`textarea-task-notes-${task.id}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          {/* Provider Notes */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any additional notes about this service..."
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[100px]"
                data-testid="textarea-provider-notes"
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-muted p-6 border-t border-border rounded-b-2xl">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              data-testid="button-save-progress"
            >
              Save Progress
            </Button>
            <Button 
              onClick={onComplete}
              disabled={!isReadyToComplete}
              className="flex-1"
              data-testid="button-complete-job"
            >
              {isReadyToComplete ? 'Complete Job' : `Complete Job (${completionRate}%)`}
            </Button>
          </div>
          {!isReadyToComplete && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Complete at least 80% of tasks to finish this job
            </p>
          )}
        </div>
      </div>
    </div>
  );
}