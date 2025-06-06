import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2025-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무 회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};

export const setupMockHandlerRepeat = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '반복 일정',
      date: '2025-05-03',
      startTime: '10:00',
      endTime: '11:00',
      description: '반복 테스트',
      location: '회의실 1',
      category: '업무',
      repeat: {
        type: 'daily',
        interval: 1,
        endDate: '2025-05-05',
      },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '반복 일정 2',
      date: '2025-05-07',
      startTime: '09:00',
      endTime: '10:00',
      description: '반복 테스트 2',
      location: '회의실 2',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-05-31',
      },
      notificationTime: 0,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1);
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),
    http.put('/api/events-list', async ({ request }) => {
      const { events } = (await request.json()) as { events: Event[] };
      events.forEach((event) => {
        const index = mockEvents.findIndex((e) => e.id === event.id);
        mockEvents[index] = { ...mockEvents[index], ...event };
      });
      return HttpResponse.json(events, { status: 200 });
    }),
    http.delete('/api/events-list', async ({ request }) => {
      const { eventIds } = (await request.json()) as { eventIds: string[] };
      eventIds.forEach((id) => {
        const index = mockEvents.findIndex((e) => e.id === id);
        if (index !== -1) mockEvents.splice(index, 1);
      });
      return new HttpResponse(null, { status: 204 });
    }),

    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};
