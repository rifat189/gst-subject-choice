/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubjectInfo {
  id: string;
  name: string;
  lastPos: string | number | null;
}

export interface UniversityInfo {
  id: string;
  shortName: string;
  fullName: string;
  subjects: SubjectInfo[];
}

export interface ChoiceItem {
  id: string;
  universityId: string;
  subjectId: string;
  note: string;
}
