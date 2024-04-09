'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import SubjectSection from '@/components/containers/SubjectSection';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AddTaskDialog } from '@/components/dashboard/Dialogs/tasks/AddTaskDialog';
import { Loader2 } from 'lucide-react';
import { AddNoteDialog } from '@/components/dashboard/Dialogs/notes/AddNoteDialog';
import { AddGradeDialog } from '@/components/dashboard/Dialogs/grades/AddGradeDialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardContent } from '@/components/ui/card';
import dayjs from 'dayjs'

export default function SubjectPage() {
  const params = useParams<{ subjectId: Id<'subjects'> }>();
  const subjectId = params?.subjectId;
  const subject = useQuery(api.subjects.getSubjectData, {
    subjectId: subjectId!
  });

  const grades = useQuery(api.grades.getSubjectGrades, {
    subjectId: subjectId!
  })

  if (!subject) {
    return <Loader2 className="h-12 w-12 animate-spin" />;
  }

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{subject?.subject.name}</h1>
        {subject.subject.addedByUser && <Badge variant="outline">Your Subject</Badge>}
      </div>
      <div className="grid gap-8">
        <SubjectSection
          title="Assignments"
          description="Assignments for your subject"
        >
          <h1>Here will be content for assignments</h1>
        </SubjectSection>
        <SubjectSection
          title="Grades"
          description="All your grades"
          addDialog={<AddGradeDialog subjectId={subjectId}/>}
        >
          <div className="grid grid-cols-6 gap-20">   
            {!grades ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
              grades?.map(grade => (
                <Card key={grade._id} className='w-64'>
                  <CardContent className='flex items-center justify-between p-4'>
                    <div className='flex flex-col items-start justify-center'>
                      <p className='font-bold text-xl'>{grade.topic}</p>
                      <p className='text-muted-foreground'>{dayjs(grade.date).format('DD.MM.YYYY')}</p>
                    </div>
                  
                    <Badge variant="outline" className='w-12 h-12 flex items-center justify-center rounded-full'>
                      <p className='font-bold text-2xl'>
                      {grade.grade}
                      </p>
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SubjectSection>
        <SubjectSection
          title="Tasks"
          description="Tasks for your subject"
          addDialog={<AddTaskDialog subjectId={subject.subject._id} />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {!subject.subjectTasks ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
              subject.subjectTasks.map(task => (
                <Card key={task._id}>
                  <CardHeader>
                    <p>{task.text}</p>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="outline">{task.status}</Badge>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </SubjectSection>
        <SubjectSection
          title="Notes"
          description="Notes for your subject"
          addDialog={<AddNoteDialog subjectId={subject.subject._id} />}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {!subject.subjectNotes ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : (
              subject.subjectNotes.map(note => (
                <Card key={note._id}>
                  <CardHeader>
                    <p>{note.text}</p>
                  </CardHeader>
                  <CardFooter>
                    <Badge variant="outline">{note.date}</Badge>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </SubjectSection>
        <SubjectSection title="Exams" description="Exmas in your subject">
          <h1>Here will be content for exams</h1>
        </SubjectSection>
      </div>
    </div>
  );
}