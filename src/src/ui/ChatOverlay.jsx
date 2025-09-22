import React, { useEffect, useRef, useState } from 'react';
import { socket, onChatMessage, sendChatMessage } from '../CoreHelpers/socket.js';

export function ChatOverlay() {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState('disconnected');
    const inputRef = useRef(null);

    useEffect(() => {
        const handleConnect = () => setStatus('connected');
        const handleDisconnect = () => setStatus('disconnected');

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };
    }, []);

    useEffect(() => {
        const handleMessage = (msg) => {
            setMessages((prev) => {
                if (prev.find((m) => m.id === msg.id)) return prev;
                return [...prev, msg].slice(-100);
            });
        };

        onChatMessage(handleMessage);
        return () => socket.off('chat:message', handleMessage);
    }, []);

    const sendMessage = () => {
        if (!text.trim() || !socket.id) return;
        const msg = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            name: socket.id,
            text: text.trim(),
            time: new Date().toISOString(),
        };
        sendChatMessage(msg);
        setText('');
    };

    useEffect(() => {
        const onKey = (e) => {
            const tag = (e.target?.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || e.target?.isContentEditable) return;
            if (e.code === 'KeyT') {
                setOpen(v => {
                    const next = !v;
                    if (next) {
                        setTimeout(() => {
                            inputRef.current?.focus();
                        }, 0);
                    }
                    return next;
                });
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const onInputKeyDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.key === 'Enter') { sendMessage(); setOpen(false); return; }
        if (e.key === 'Escape') { setOpen(false); return; }

        const target = e.target;
        const start = target.selectionStart ?? text.length;
        const end = target.selectionEnd ?? text.length;

        if (e.key === 'Backspace' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (start === end && start > 0) {
                const next = text.slice(0, start - 1) + text.slice(end);
                setText(next);
                requestAnimationFrame(() => {
                    try { target.setSelectionRange(start - 1, start - 1); } catch {}
                });
            } else if (start !== end) {
                const next = text.slice(0, start) + text.slice(end);
                setText(next);
                requestAnimationFrame(() => {
                    try { target.setSelectionRange(start, start); } catch {}
                });
            }
            return;
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const next = text.slice(0, start) + e.key + text.slice(end);
            setText(next);
            requestAnimationFrame(() => {
                try { target.setSelectionRange(start + 1, start + 1); } catch {}
            });
        }
    };

    return (
        <div style={{
            position: 'fixed',
            left: 12,
            bottom: 12,
            width: '40vw',
            maxWidth: 560,
            fontFamily: 'system-ui, sans-serif',
            color: '#fff',
            zIndex: 1000,
            pointerEvents: 'none',
        }}>
        <div
        className="disable-text-selection"
        style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: 8,
            maxHeight: '32vh',
            overflowY: 'auto',
            pointerEvents: 'auto',
        }}
        >
        {messages.slice(-10).map((m) => (
            <div key={m.id} style={{ fontSize: 14, lineHeight: 1.35, marginBottom: 2 }}>
            <span style={{ color: '#a0e' }}>[{m.name}]</span> {m.text}
            </div>
        ))}
        {!messages.length && (
            <div style={{ fontSize: 13, opacity: 0.8 }}>
                Brak wiadomości. Naciśnij T, aby pisać. {status !== 'connected' ? '(offline)' : ''}
            </div>
        )}
        </div>

        {open && (
            <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={status === 'connected' ? 'Napisz wiadomość i Enter, Esc aby zamknąć' : 'Offline: Enter wysyła lokalnie'}
            style={{
                marginTop: 6,
                width: '100%',
                padding: '8px 10px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#fff',
                  outline: 'none',
                  fontSize: 14,
                  pointerEvents: 'auto',
            }}
            />
        )}
        </div>
    );
}
