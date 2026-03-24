import Notification from '../models/Notification.js';

/**
 * Persist an in-app notification. Never throws — failures are logged so the main flow still succeeds.
 */
export async function notifyUser(payload) {
  try {
    await Notification.create(payload);
  } catch (err) {
    console.error('[notifyUser]', err?.message || err);
  }
}
