import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, UserRound } from 'lucide-react';
import { useLang } from '../context/LangContext';

const ProfilePhoto = ({ user, size = 'large' }) => {
  const { t } = useLang();
  const inputRef = useRef(null);
  const storageKey = useMemo(() => `profilePhoto:${user?.id || user?.email || 'guest'}`, [user?.email, user?.id]);
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    setPhoto(localStorage.getItem(storageKey) || '');
  }, [storageKey]);

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 480;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const nextPhoto = canvas.toDataURL('image/jpeg', 0.82);
        localStorage.setItem(storageKey, nextPhoto);
        setPhoto(nextPhoto);
      };
      image.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  const dimensions = size === 'compact' ? 'h-28 w-28' : 'h-32 w-32 md:h-36 md:w-36';

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`${dimensions} group relative overflow-hidden rounded-lg bg-slate-100 ring-4 ring-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl`}
        title={photo ? t('changeProfilePhoto') : t('uploadProfilePhoto')}
      >
        {photo ? (
          <img src={photo} alt={t('profilePhoto')} className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-gradient-to-br from-sky-100 to-emerald-100 text-cwd-blue">
            <UserRound className="h-12 w-12" />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-slate-950/75 px-3 py-2 text-xs font-black text-white opacity-0 transition group-hover:opacity-100">
          <Camera className="h-4 w-4" />
          {photo ? t('changeProfilePhoto') : t('uploadProfilePhoto')}
        </span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-black text-white transition hover:bg-slate-800"
      >
        {photo ? t('changeProfilePhoto') : t('uploadProfilePhoto')}
      </button>
    </div>
  );
};

export default ProfilePhoto;
