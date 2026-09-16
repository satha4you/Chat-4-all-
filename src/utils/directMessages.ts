import { ChatMessage, UserProfile } from '../types';
import { safeSetItem } from './storage';
import { getSocket } from '../services/realtime';

export const DM_STORAGE_KEY = 'royal_voice_direct_messages';

/**
 * Loads all saved direct message threads from LocalStorage
 */
export function loadAllDirectMessages(): Record<string, ChatMessage[]> {
  try {
    const raw = localStorage.getItem(DM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[DirectMessages] Failed to load messages from storage:', e);
  }
  return {};
}

/**
 * Saves all direct message threads to LocalStorage safely
 */
export function saveAllDirectMessages(history: Record<string, ChatMessage[]>): boolean {
  try {
    const success = safeSetItem(DM_STORAGE_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event('storage'));
    return success;
  } catch (e) {
    console.warn('[DirectMessages] Failed to save messages:', e);
    return false;
  }
}

/**
 * Sends a direct message between sender and recipient, persisting to LocalStorage
 * and emitting real-time socket events.
 */
export function sendDirectChatMessage(
  sender: UserProfile,
  targetUser: UserProfile,
  content: string
): ChatMessage {
  const newMsg: ChatMessage = {
    id: `dm_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    sender,
    content: content.trim(),
    type: 'text',
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
  };

  const currentHistory = loadAllDirectMessages();

  // Save under targetUser.id (for the sender's view of this chat)
  const targetThread = currentHistory[targetUser.id] || [];
  currentHistory[targetUser.id] = [...targetThread, newMsg];

  // Save under sender.id (so if targetUser views sender, it is there too)
  const senderThread = currentHistory[sender.id] || [];
  currentHistory[sender.id] = [...senderThread, newMsg];

  saveAllDirectMessages(currentHistory);

  // Broadcast real-time
  try {
    const socket = getSocket();
    socket.emit('dm:send', {
      targetUserId: targetUser.id,
      message: newMsg,
    });
  } catch (err) {
    // optional socket
  }

  return newMsg;
}
