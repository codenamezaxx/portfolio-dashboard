/**
 * Notification System Tests
 */

import {
  notify,
  onNotification,
  notifyContentChange,
  notifyUpdateSuccess,
  notifyError,
  getNotificationHistory,
  clearNotificationHistory,
  getListenerCount
} from './notifications';

describe('Notification System', () => {
  beforeEach(() => {
    clearNotificationHistory();
  });

  describe('notify', () => {
    it('should create a notification', () => {
      const notification = notify('success', 'Test', 'Test message');

      expect(notification).toHaveProperty('id');
      expect(notification.type).toBe('success');
      expect(notification.title).toBe('Test');
      expect(notification.message).toBe('Test message');
    });

    it('should generate unique IDs', () => {
      const notif1 = notify('info', 'Test 1', 'Message 1');
      const notif2 = notify('info', 'Test 2', 'Message 2');

      expect(notif1.id).not.toBe(notif2.id);
    });

    it('should call listeners', (done) => {
      const listener = jest.fn();
      onNotification(listener);

      notify('success', 'Test', 'Message');

      setTimeout(() => {
        expect(listener).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should support different notification types', () => {
      const types = ['success', 'info', 'warning', 'error'] as const;

      types.forEach((type) => {
        const notification = notify(type, 'Test', 'Message');
        expect(notification.type).toBe(type);
      });
    });
  });

  describe('onNotification', () => {
    it('should subscribe to notifications', (done) => {
      const listener = jest.fn();
      onNotification(listener);

      notify('info', 'Test', 'Message');

      setTimeout(() => {
        expect(listener).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('should return unsubscribe function', (done) => {
      const listener = jest.fn();
      const unsubscribe = onNotification(listener);

      notify('info', 'Test 1', 'Message 1');

      unsubscribe();

      notify('info', 'Test 2', 'Message 2');

      setTimeout(() => {
        expect(listener).toHaveBeenCalledTimes(1); // Only first notification
        done();
      }, 0);
    });

    it('should support multiple listeners', (done) => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      onNotification(listener1);
      onNotification(listener2);

      notify('info', 'Test', 'Message');

      setTimeout(() => {
        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('Convenience functions', () => {
    it('should notify content change', (done) => {
      const listener = jest.fn();
      onNotification(listener);

      notifyContentChange({
        type: 'UPDATE',
        table: 'projects',
        record: {},
        timestamp: Date.now()
      });

      setTimeout(() => {
        expect(listener).toHaveBeenCalled();
        const notification = listener.mock.calls[0][0];
        expect(notification.type).toBe('info');
        done();
      }, 0);
    });

    it('should notify update success', (done) => {
      const listener = jest.fn();
      onNotification(listener);

      notifyUpdateSuccess('Project');

      setTimeout(() => {
        expect(listener).toHaveBeenCalled();
        const notification = listener.mock.calls[0][0];
        expect(notification.type).toBe('success');
        expect(notification.title).toContain('successful');
        done();
      }, 0);
    });

    it('should notify error', (done) => {
      const listener = jest.fn();
      onNotification(listener);

      notifyError('Error Title', 'Error message');

      setTimeout(() => {
        expect(listener).toHaveBeenCalled();
        const notification = listener.mock.calls[0][0];
        expect(notification.type).toBe('error');
        done();
      }, 0);
    });
  });

  describe('Notification history', () => {
    it('should track notification history', () => {
      notify('info', 'Test 1', 'Message 1');
      notify('success', 'Test 2', 'Message 2');
      notify('error', 'Test 3', 'Message 3');

      const history = getNotificationHistory();
      expect(history.length).toBe(3);
    });

    it('should limit history by count', () => {
      for (let i = 0; i < 15; i++) {
        notify('info', `Test ${i}`, `Message ${i}`);
      }

      const history = getNotificationHistory(10);
      expect(history.length).toBe(10);
    });

    it('should clear notification history', () => {
      notify('info', 'Test', 'Message');
      expect(getNotificationHistory().length).toBe(1);

      clearNotificationHistory();
      expect(getNotificationHistory().length).toBe(0);
    });
  });

  describe('Listener count', () => {
    it('should track listener count', () => {
      expect(getListenerCount()).toBe(0);

      const unsubscribe1 = onNotification(() => {});
      expect(getListenerCount()).toBe(1);

      const unsubscribe2 = onNotification(() => {});
      expect(getListenerCount()).toBe(2);

      unsubscribe1();
      expect(getListenerCount()).toBe(1);

      unsubscribe2();
      expect(getListenerCount()).toBe(0);
    });
  });
});
