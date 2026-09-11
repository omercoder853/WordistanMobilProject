import { useState } from "react";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { WORDISTAN_LOGO_BASE64 } from "../shared/assets/logoBase64";
import { useFeedback } from "../contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";

export default function useExports() {
    const [isExporting, setIsExporting] = useState(false);
    const { setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible, hideAlert } = useFeedback();
    const {t} = useTranslation();

    // İsim çakışmasını önleyen yardımcı fonksiyon
    const getUniqueFile = (baseName, extension) => {
        let fileName = `${baseName}.${extension}`;
        let file = new File(Paths.cache, fileName);
        let counter = 1;

        while (file.exists) {
            fileName = `${baseName} (${counter}).${extension}`;
            file = new File(Paths.cache, fileName);
            counter++;
        }

        return file;
    };

    const escapeHtml = (text) => {
        if (!text) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // PDF HTML Şablon Üreteci
    const generatePdfHtml = ({ dict, words }) => {
        const formattedLang = dict?.language === "TR to ENG" ? "TR → ENG" : dict?.language === "ENG to TR" ? "ENG → TR" : (dict?.language || "TR → ENG");
        const exportDate = new Date().toLocaleDateString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
        const dictName = dict?.name || "Wordistan Sözlüğü";
        const dictDesc = dict?.description || "";
        const totalWords = (words || []).length;

        const rowsHtml = (words && words.length > 0)
            ? words.map((item, index) => `
                <tr>
                    <td class="col-index center">${index + 1}</td>
                    <td class="col-word">${escapeHtml(item.word)}</td>
                    <td class="col-meaning">${escapeHtml(item.meaning)}</td>
                </tr>
            `).join("")
            : `<tr><td colspan="3" class="center empty-row">Bu sözlükte henüz kelime bulunmamaktadır.</td></tr>`;

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(dictName)}</title>
    <style>
        @page {
            size: A4;
            margin: 14mm 14mm 18mm 14mm;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1E1B4B;
            background-color: #FFFFFF;
            font-size: 13px;
            line-height: 1.5;
            padding: 0;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 16px;
            border-bottom: 2px solid #F1F5F9;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 14px;
        }
        .logo-img {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            object-fit: contain;
        }
        .brand-info {
            display: flex;
            flex-direction: column;
        }
        .brand-title {
            font-size: 22px;
            font-weight: 800;
            color: #8E4A7C;
            letter-spacing: -0.5px;
            line-height: 1.2;
        }
        .brand-tagline {
            font-size: 11px;
            font-weight: 600;
            color: #64748B;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-top: 2px;
        }
        .header-right {
            text-align: right;
        }
        .doc-title {
            font-size: 17px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 5px;
        }
        .meta-badge-group {
            display: flex;
            gap: 6px;
            justify-content: flex-end;
            align-items: center;
        }
        .badge {
            display: inline-block;
            padding: 3px 9px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
        }
        .badge-lang {
            background-color: #FDF2F8;
            color: #8E4A7C;
            border: 1px solid #FBCFE8;
        }
        .badge-count {
            background-color: #F1F5F9;
            color: #475569;
        }
        .badge-date {
            background-color: #F8FAFC;
            color: #64748B;
            border: 1px solid #E2E8F0;
        }
        .accent-bar {
            height: 3px;
            background: linear-gradient(90deg, #8E4A7C 0%, #C084FC 60%, #F3E8FF 100%);
            border-radius: 2px;
            margin-top: 2px;
            margin-bottom: 20px;
        }
        .desc-box {
            background-color: #FAF6F8;
            border-left: 4px solid #8E4A7C;
            padding: 10px 14px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 18px;
            font-size: 12px;
            color: #475569;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #EDE9FE;
            margin-bottom: 24px;
        }
        thead {
            display: table-header-group;
        }
        tr {
            page-break-inside: avoid;
        }
        th {
            background-color: #8E4A7C;
            color: #FFFFFF;
            font-size: 11.5px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 11px 14px;
            text-align: left;
        }
        th.center, td.center {
            text-align: center;
        }
        td {
            padding: 10px 14px;
            border-top: 1px solid #F1F5F9;
            font-size: 12.5px;
        }
        tbody tr:nth-child(even) {
            background-color: #FAF6F8;
        }
        tbody tr:nth-child(odd) {
            background-color: #FFFFFF;
        }
        .col-index {
            width: 8%;
            font-weight: 600;
            color: #94A3B8;
        }
        .col-word {
            width: 44%;
            font-weight: 700;
            color: #1E1B4B;
        }
        .col-meaning {
            width: 48%;
            color: #334155;
            font-weight: 500;
        }
        .empty-row {
            padding: 24px;
            color: #94A3B8;
            font-style: italic;
        }
        .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #F1F5F9;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 10.5px;
            color: #94A3B8;
        }
        .footer-brand {
            font-weight: 600;
            color: #8E4A7C;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <img src="${WORDISTAN_LOGO_BASE64}" class="logo-img" alt="Wordistan Logo" />
            <div class="brand-info">
                <span class="brand-title">Wordistan</span>
                <span class="brand-tagline">Kelime Krallığı • Word Kingdom</span>
            </div>
        </div>
        <div class="header-right">
            <div class="doc-title">${escapeHtml(dictName)}</div>
            <div class="meta-badge-group">
                <span class="badge badge-lang">${escapeHtml(formattedLang)}</span>
                <span class="badge badge-count">${totalWords} kelime</span>
                <span class="badge badge-date">${exportDate}</span>
            </div>
        </div>
    </div>
    <div class="accent-bar"></div>

    ${dictDesc ? `<div class="desc-box">"${escapeHtml(dictDesc)}"</div>` : ""}

    <table>
        <thead>
            <tr>
                <th class="col-index center">#</th>
                <th class="col-word">Kelime / Word</th>
                <th class="col-meaning">Anlamı / Meaning</th>
            </tr>
        </thead>
        <tbody>
            ${rowsHtml}
        </tbody>
    </table>

    <div class="footer">
        <span><strong class="footer-brand">Wordistan</strong> Mobile • Öğren, Keşfet, Genişlet</span>
        <span>Dışa Aktarılma Tarihi: ${exportDate}</span>
    </div>
</body>
</html>
        `;
    };

    // ORTAK PAYLAŞIM VE TEMİZLİK MOTORU
    const shareFile = async ({ dictName, extension, content, mimeType, uti }) => {
        let file = null;
        try {
            setIsExporting(true);

            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                setAlertTitle(t('error'));
                setAlertMessage(t('fileSharingNotSupported'));
                addAlertButton({text:t('cancel') , style:'danger' , action:hideAlert});
                setAlertVisible(true);
                return;
            }

            const safeName = (dictName || "dictionary").replace(/\s+/g, "_");
            file = getUniqueFile(safeName, extension);

            file.create();
            file.write(content);

            await Sharing.shareAsync(file.uri, {
                mimeType: mimeType,
                dialogTitle: `${dictName || "Sözlük"} Dışa Aktar`,
                UTI: uti,
            });
        } catch (error) {
            console.error(`${extension.toUpperCase()} paylaşım hatası:`, error);
            setAlertTitle(t('error'));
            setAlertMessage(t('fileShareFailed'));
            addAlertButton({text:t('cancel') , style:'danger' , action:hideAlert});
            setAlertVisible(true);
        } finally {
            if (file && file.exists) {
                console.log("File removed from cache");
                file.delete();
            }
            setIsExporting(false);
        }
    };

    const shareAsJson = async ({ dict, words }) => {
        const cleanWords = (words || []).map((item, index) => ({
            id: index + 1,
            word: item.word,
            meaning: item.meaning,
        }));

        await shareFile({
            dictName: dict?.name,
            extension: "json",
            content: JSON.stringify(cleanWords, null, 2),
            mimeType: "application/json",
            uti: "public.json",
        });
    };

    const shareAsTxt = async ({ dict, words }) => {
        const content = (words || [])
            .map((item, index) => `${index + 1}. ${item.word} - ${item.meaning}`)
            .join("\n");

        await shareFile({
            dictName: dict?.name,
            extension: "txt",
            content,
            mimeType: "text/plain",
            uti: "public.plain-text",
        });
    };

    // CSV için özel karakter ve tırnak temizleyici
    const formatCsvCell = (value) => {
        if (value === null || value === undefined) return '""';
        const str = String(value).replace(/"/g, '""'); // İçerideki " işaretlerini "" yap
        return `"${str}"`;
    };

    const shareAsCsv = async ({ dict, words }) => {
        const BOM = "\uFEFF";
        const header = ["ID", "Word", "Meaning"].map(formatCsvCell).join(",");

        const rows = (words || []).map((item, index) => {
            const id = formatCsvCell(index + 1);
            const word = formatCsvCell(item.word);
            const meaning = formatCsvCell(item.meaning);
            return `${id},${word},${meaning}`;
        });

        const csvContent = `${BOM}${header}\n${rows.join("\n")}`;

        await shareFile({
            dictName: dict?.name,
            extension: "csv",
            content: csvContent,
            mimeType: "text/csv",
            uti: "public.comma-separated-values-text",
        });
    };

    const shareAsPdf = async ({ dict, words }) => {
        let tempPrintFile = null;
        let destFile = null;
        try {
            setIsExporting(true);

            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                setAlertTitle(t('error'));
                setAlertMessage(t('fileSharingNotSupported'));
                addAlertButton({text:t('cancel') , style:'danger' , action:hideAlert});
                setAlertVisible(true);
                return;
            }

            const html = generatePdfHtml({ dict, words });
            const printResult = await Print.printToFileAsync({ html });

            tempPrintFile = new File(printResult.uri);

            const safeName = (dict?.name || "dictionary").replace(/\s+/g, "_");
            destFile = getUniqueFile(safeName, "pdf");

            tempPrintFile.move(destFile);

            await Sharing.shareAsync(destFile.uri, {
                mimeType: "application/pdf",
                dialogTitle: `${dict?.name || "Sözlük"} PDF Dışa Aktar`,
                UTI: "com.adobe.pdf",
            });
        } catch (error) {
            console.error("PDF paylaşım hatası:", error);
            setAlertTitle(t('error'));
            setAlertMessage(t('fileShareFailed'));
            addAlertButton({text:t('cancel') , style:'danger' , action:hideAlert});
            setAlertVisible(true);
        } finally {
            if (tempPrintFile && tempPrintFile.exists) {
                tempPrintFile.delete();
            }
            if (destFile && destFile.exists) {
                console.log("PDF file removed from cache");
                destFile.delete();
            }
            setIsExporting(false);
        }
    };

    return {
        isExporting,
        shareAsJson,
        shareAsTxt,
        shareAsCsv,
        shareAsPdf,
    };
}