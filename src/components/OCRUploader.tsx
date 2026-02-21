import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Loader2, Clipboard } from 'lucide-react';
import { parseRideData } from '../utils/ocrParser';

interface OCRUploaderProps {
    onDataFound: (data: { fare: number; distance: number; time: number }) => void;
}

const OCRUploader = ({ onDataFound }: OCRUploaderProps) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const processImage = async (file: File | Blob) => {
        setLoading(true);
        setStatus('Iniciando leitura...');

        try {
            const worker = await Tesseract.createWorker('por');
            setStatus('Lendo texto...');

            const ret = await worker.recognize(file);
            const text = ret.data.text;
            console.log("OCR Text:", text);

            const { fare, distance, time } = parseRideData(text);

            if (fare || distance || time) {
                onDataFound({ fare, distance, time });
                setStatus('Leitura concluída!');
            } else {
                setStatus('Não identifiquei valores. Tente manual.');
            }

            await worker.terminate();
        } catch (err) {
            console.error(err);
            setStatus('Erro na leitura.');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processImage(e.target.files[0]);
        }
    };

    // Paste Event Listener
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) processImage(blob);
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []); // eslint-disable-line

    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
                <label className="flex-1 btn-primary bg-dark-card border border-dark-border text-white text-sm py-3 cursor-pointer hover:bg-dark-border transition-colors">
                    <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                    {loading ? <Loader2 className="animate-spin" /> : <Camera size={18} />}
                    <span>Ler Print/Foto</span>
                </label>

                <div className="hidden md:flex items-center justify-center px-4 bg-dark-card border border-dark-border rounded-xl text-xs text-gray-500 gap-1" title="Cole uma imagem (Ctrl+V)">
                    <Clipboard size={14} />
                    <span>Cole (Ctrl+V)</span>
                </div>
            </div>

            {status && (
                <p className={`text-center text-xs ${status.includes('Erro') ? 'text-danger' : 'text-primary'}`}>
                    {status}
                </p>
            )}
        </div>
    );
};

export default OCRUploader;
