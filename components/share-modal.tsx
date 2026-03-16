'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Copy, 
  Check,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  text?: string;
  url?: string;
}

const SHARE_PLATFORMS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: 'bg-[#25D366] hover:bg-[#20BD5A]',
    getUrl: (url: string, text: string) => 
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: 'bg-black hover:bg-gray-900',
    getUrl: (url: string, text: string) => 
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    getUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    color: 'bg-[#0088CC] hover:bg-[#007AB8]',
    getUrl: (url: string, text: string) => 
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'bg-[#0A66C2] hover:bg-[#094D92]',
    getUrl: (url: string, text: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'sms',
    name: 'Mensaje',
    icon: MessageCircle,
    color: 'bg-primary hover:bg-primary/90',
    getUrl: (url: string, text: string) => 
      `sms:?body=${encodeURIComponent(text + ' ' + url)}`,
  },
];

export function ShareModal({ open, onOpenChange, title, text, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://brujulapiscis.com');
  const shareText = text || 'Descubre Brujula Piscis - Tu coach de decisiones diseñado para Piscis';
  const shareTitle = title || 'Brujula Piscis';

  const handleShare = (platform: typeof SHARE_PLATFORMS[0]) => {
    const shareLink = platform.getUrl(shareUrl, shareText);
    window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border max-w-sm mx-4">
        <DialogHeader className="text-center">
          <DialogTitle className="font-serif text-xl">Compartir Brujula Piscis</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Invita a otros Piscis a encontrar su claridad
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Native share button (mobile) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button 
              className="w-full h-12 gap-2"
              onClick={handleNativeShare}
            >
              <Share2 className="w-5 h-5" />
              Compartir
            </Button>
          )}

          {/* Social platforms grid */}
          <div className="grid grid-cols-3 gap-3">
            {SHARE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform)}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-white transition-all',
                  platform.color
                )}
              >
                {typeof platform.icon === 'function' ? (
                  <platform.icon />
                ) : (
                  <platform.icon className="w-6 h-6" />
                )}
                <span className="text-xs font-medium">{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Copy link */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-foreground outline-none truncate"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Cada Piscis que invites recibe 3 decisiones gratis
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easy sharing
export function useShare() {
  const [isOpen, setIsOpen] = useState(false);

  const openShare = () => setIsOpen(true);
  const closeShare = () => setIsOpen(false);

  return {
    isOpen,
    openShare,
    closeShare,
    setIsOpen,
  };
}
