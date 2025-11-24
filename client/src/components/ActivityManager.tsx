import { useState } from 'react';
import { useSchedule } from '@/contexts/ScheduleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import toast from 'react-hot-toast';

export function ActivityManager() {
  const { activities, addActivity, updateActivity, deleteActivity, language } = useSchedule();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameKh, setNameKh] = useState('');

  const labels = {
    en: {
      title: 'Manage Activities',
      addNew: 'Add New Activity',
      nameEn: 'Activity Name (English)',
      nameKh: 'Activity Name (Khmer)',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      added: 'Activity added successfully',
      updated: 'Activity updated successfully',
      deleted: 'Activity deleted successfully',
    },
    kh: {
      title: 'គ្រប់គ្រងសកម្មភាព',
      addNew: 'បន្ថែមសកម្មភាពថ្មី',
      nameEn: 'ឈ្មោះសកម្មភាព (អង់គ្លេស)',
      nameKh: 'ឈ្មោះសកម្មភាព (ខ្មែរ)',
      save: 'រក្សាទុក',
      edit: 'កែសម្រួល',
      delete: 'លុប',
      added: 'បានបន្ថែមសកម្មភាពដោយជោគជ័យ',
      updated: 'បានធ្វើបច្ចុប្បន្នភាពសកម្មភាព',
      deleted: 'បានលុបសកម្មភាព',
    },
  };

  const t = labels[language];

  const handleSave = () => {
    if (!nameEn.trim()) return;

    if (editingId) {
      updateActivity(editingId, { name: nameEn, nameKh: nameKh || undefined });
      toast.success(t.updated);
    } else {
      addActivity({ name: nameEn, nameKh: nameKh || undefined });
      toast.success(t.added);
    }

    setNameEn('');
    setNameKh('');
    setEditingId(null);
    setIsOpen(false);
  };

  const handleEdit = (activity: any) => {
    setEditingId(activity.id);
    setNameEn(activity.name);
    setNameKh(activity.nameKh || '');
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
    toast.success(t.deleted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={language === 'kh' ? 'font-khmer' : 'font-outfit'} data-testid="button-manage-activities">
          <IconPlus className="w-4 h-4 mr-2" />
          {t.title}
        </Button>
      </DialogTrigger>
      <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${language === 'kh' ? 'font-khmer' : 'font-outfit'}`}>
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <Input
              placeholder={t.nameEn}
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              data-testid="input-activity-name-en"
              className="font-outfit"
            />
            <Input
              placeholder={t.nameKh}
              value={nameKh}
              onChange={(e) => setNameKh(e.target.value)}
              data-testid="input-activity-name-kh"
              className="font-khmer"
            />
            <Button onClick={handleSave} className="w-full" data-testid="button-save-activity">
              <IconPlus size={16} className="mr-2" />
              {editingId ? t.save : t.addNew}
            </Button>
          </div>

          <div className="space-y-2">
            {activities.map((activity) => (
              <Card key={activity.id} className="p-3 hover-elevate" data-testid={`card-activity-${activity.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate font-outfit">{activity.name}</p>
                    {activity.nameKh && (
                      <p className="text-sm text-muted-foreground truncate font-khmer">{activity.nameKh}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(activity)}
                      data-testid={`button-edit-${activity.id}`}
                    >
                      <IconEdit scale={23} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(activity.id)}
                      data-testid={`button-delete-${activity.id}`}
                    >
                      <IconTrash scale={23} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
