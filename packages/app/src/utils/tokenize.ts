/*! Copyright (c) 2022, XAPP AI */
import nlp from 'compromise/one'

export interface Term {
    text: string;
}

export interface Sentence {
    text: string;
    terms: Term[]
}

export function tokenize(q: string): Sentence[] {
    const doc = nlp(q)
    return doc.json();
}