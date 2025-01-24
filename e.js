// ==UserScript==
// @name         e-consule slots extender
// @version      2025-01-23
// @description  Extends appointment slots for Ukrainian Embassy
// @author       Alex Dor
// @match        https://e-consul.gov.ua/tasks/*
// @icon         https://e-consul.gov.ua/static/media/uasign.ff4c74d0.svg
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    const documentTemplateId = '161374001';
    const targetUrl = `https://my.e-consul.gov.ua/document-templates/${documentTemplateId}`;
    const numbersOfWeeksToAdd = 10;
    const originalMaxDateScript = `"maxDate":"(moment, value, step, document) => { const numberWeeks = Number(document?.placeOfVisitInfo?.consularInstitution?.data?.numberWeeks); return moment().add(numberWeeks, 'w')}"`;
    const updatedMaxDateScript = `"maxDate":"(moment, value, step, document) => { const numberWeeks = Number(document?.placeOfVisitInfo?.consularInstitution?.data?.numberWeeks); return moment().add(numberWeeks + ${numbersOfWeeksToAdd}, 'w')}"`;

    let original_fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (url, init) => {
        let response = await original_fetch(url, init);
        if (url === targetUrl) {
            let clonedResponse = response.clone();
            const bodyText = await clonedResponse.text();
            const modifiedBody = bodyText.replace(originalMaxDateScript, updatedMaxDateScript);

            return new Response(modifiedBody, {
                status: clonedResponse.status,
                statusText: clonedResponse.statusText,
                headers: clonedResponse.headers
            });
        }
        return response;
    };
})();
