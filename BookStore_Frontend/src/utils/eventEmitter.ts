type EventCallback<T = unknown> = (data?: T) => void;

class EventEmitter {
    private events: Map<string, Set<EventCallback>> = new Map();

    /**
     * Subscribe to an event
     * @param event The event name to subscribe to
     * @param callback The callback function to be called when the event is emitted
     */
    on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event)!.add(callback);
    }

    /**
     * Unsubscribe from an event
     * @param event The event name to unsubscribe from
     * @param callback The exact callback function to remove
     */
    off(event: string, callback: EventCallback): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            callbacks.delete(callback);

            // Clean up empty event sets to prevent memory leaks
            if (callbacks.size === 0) {
                this.events.delete(event);
            }
        }
    }

    /**
     * Emit an event to all subscribers
     * @param event The event name to emit
     * @param data Optional data to pass to all callbacks
     */
    emit<T>(event: string, data?: T): void {
        const callbacks = this.events.get(event);
        if (callbacks) {
            // Use Array.from to avoid issues if callbacks modify the set during iteration
            Array.from(callbacks).forEach((callback) => {
                try {
                    // Type assertion is safe because callback accepts any data
                    (callback as EventCallback<T>)(data);
                } catch (error) {
                    console.error(`Error in event callback for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Remove all listeners for a specific event or all events
     * @param event Optional event name to remove listeners for. If omitted, removes all listeners.
     */
    removeAllListeners(event?: string): void {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }
}

// Singleton instance
export const eventEmitter = new EventEmitter();

/**
 * Centralized event names used across the application
 */
export const EVENTS = {
    // User events
    USER_UPDATED: 'USER_UPDATED',
    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',

    // Cart events
    CART_UPDATED: 'CART_UPDATED',
    CART_ITEM_ADDED: 'CART_ITEM_ADDED',
    CART_ITEM_REMOVED: 'CART_ITEM_REMOVED',
    CART_CLEARED: 'CART_CLEARED',

    // Wishlist events
    WISHLIST_UPDATED: 'WISHLIST_UPDATED',
    WISHLIST_ITEM_ADDED: 'WISHLIST_ITEM_ADDED',
    WISHLIST_ITEM_REMOVED: 'WISHLIST_ITEM_REMOVED',

    // Notification events
    NOTIFICATION_UPDATED: 'NOTIFICATION_UPDATED',
    NEW_NOTIFICATION: 'NEW_NOTIFICATION',
    NOTIFICATION_READ: 'NOTIFICATION_READ',

    // Order events
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_UPDATED: 'ORDER_UPDATED',
} as const;

export type EventName = keyof typeof EVENTS;