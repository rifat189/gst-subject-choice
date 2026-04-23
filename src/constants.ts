/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UniversityInfo } from './types';

export const INITIAL_UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'iu',
    shortName: 'IU',
    fullName: 'Islamic University',
    subjects: [
      { id: 'acce', name: 'Applied Chemistry & Chemical Engineering', lastPos: 1340 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 2158 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 1700 },
      { id: 'ict', name: 'Information & Communication Technology', lastPos: 2711 },
      { id: 'bme', name: 'Biomedical Engineering', lastPos: 3914 },
      { id: 'anft', name: 'Applied Nutrition & Food Technology', lastPos: 4800 },
      { id: 'btge', name: 'Biotechnology & Genetic Engineering', lastPos: 2400 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 1500 },
      { id: 'math', name: 'Mathematics', lastPos: 8397 },
      { id: 'sds', name: 'Statistics', lastPos: 5500 },
      { id: 'esg', name: 'Environmental Science & Geography', lastPos: 11967 },
    ]
  },
  {
    id: 'mbstu',
    shortName: 'MBSTU',
    fullName: 'Mawlana Bhashani Science and Technology University (MBSTU)',
    subjects: [
      { id: 'me', name: 'Mechanical Engineering', lastPos: 2516 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 489 },
      { id: 'ict', name: 'Information & Communication Technology', lastPos: 1248 },
      { id: 'te', name: 'Textile Engineering', lastPos: 2192 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 858 },
      { id: 'bge', name: 'Biotechnology & Genetic Engineering', lastPos: 1546 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 320 },
      { id: 'ftns', name: 'Food Technology & Nutritional Science', lastPos: 3020 },
      { id: 'esrm', name: 'Environmental Science & Resource Management', lastPos: 4427 },
      { id: 'cps', name: 'Criminology & Police Science', lastPos: 5728 },
      { id: 'phy', name: 'Physics', lastPos: 6171 },
      { id: 'chem', name: 'Chemistry', lastPos: 3011 },
      { id: 'math', name: 'Mathematics', lastPos: 6468 },
      { id: 'stats', name: 'Statistics', lastPos: 6027 },
      { id: 'eco', name: 'Economics', lastPos: 6645 },
      { id: 'mgt', name: 'Management', lastPos: 8523 },
      { id: 'ais', name: 'Accounting', lastPos: 7601 },
    ]
  },
  {
    id: 'pstu',
    shortName: 'PSTU',
    fullName: 'Patuakhali Science and Technology University (PSTU)',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4522 },
      { id: 'nfs', name: 'Nutrition & Food Science', lastPos: 8250 },
      { id: 'esdm', name: 'Environmental Science & Disaster Management', lastPos: 10206 },
    ]
  },
  {
    id: 'nstu',
    shortName: 'NSTU',
    fullName: 'Noakhali Science and Technology University (NSTU)',
    subjects: [
      { id: 'pharm', name: 'Pharmacy', lastPos: 555 },
      { id: 'cste', name: 'Computer Science & Telecommunication Engineering', lastPos: 1312 },
      { id: 'acce', name: 'Applied Chemistry & Chemical Engineering', lastPos: 1840 },
      { id: 'micro', name: 'Microbiology', lastPos: 2348 },
      { id: 'bge', name: 'Biotechnology & Genetic Engineering', lastPos: 3499 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 3503 },
      { id: 'fims', name: 'Fisheries & Marine Science', lastPos: 5898 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 3002 },
      { id: 'iit', name: 'Information Technology (IIT)', lastPos: 2988 },
      { id: 'esdm', name: 'Environmental Science & Disaster Management', lastPos: 7590 },
      { id: 'ftns', name: 'Food Technology & Nutritional Science', lastPos: 5827 },
      { id: 'ice', name: 'Information & Communication Engineering', lastPos: 3773 },
      { id: 'agri', name: 'Agriculture', lastPos: 3754 },
      { id: 'amath', name: 'Applied Mathematics', lastPos: 6693 },
      { id: 'stat', name: 'Statistics', lastPos: 7411 },
      { id: 'che', name: 'Chemistry', lastPos: 6301 },
      { id: 'phy', name: 'Physics', lastPos: 8968 },
      { id: 'zoo', name: 'Zoology', lastPos: 8968 },
      { id: 'swes', name: 'Software Engineering', lastPos: 9771 },
      { id: 'ocean', name: 'Oceanography', lastPos: 11819 },
    ]
  },
  {
    id: 'jkkniu',
    shortName: 'JKKNIU',
    fullName: 'Jatiya Kabi Kazi Nazrul Islam University',
    subjects: [
      { id: 'bangla', name: 'Bangla', lastPos: 12044 },
      { id: 'english', name: 'English', lastPos: 11396 },
      { id: 'music', name: 'Music', lastPos: null },
      { id: 'phil', name: 'Philosophy', lastPos: 12308 },
      { id: 'history', name: 'History', lastPos: 12246 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 3172 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 4929 },
      { id: 'ese', name: 'Environmental Science & Engineering', lastPos: 7447 },
      { id: 'stats', name: 'Statistics', lastPos: 8665 },
      { id: 'eco', name: 'Economics', lastPos: 9028 },
      { id: 'pags', name: 'Public Administration & Governance Studies', lastPos: 9646 },
      { id: 'folklore', name: 'Folklore', lastPos: 14513 },
      { id: 'anthro', name: 'Anthropology', lastPos: null },
      { id: 'pop', name: 'Population Science', lastPos: null },
      { id: 'lgdu', name: 'Local Government & Urban Development', lastPos: 11990 },
      { id: 'soc', name: 'Sociology', lastPos: 11620 },
      { id: 'ais', name: 'Accounting & Information Systems', lastPos: 9747 },
      { id: 'finance', name: 'Finance & Banking', lastPos: 6125 },
      { id: 'hrm', name: 'Human Resource Management', lastPos: 9860 },
      { id: 'mgt', name: 'Management', lastPos: 10730 },
      { id: 'mkt', name: 'Marketing', lastPos: 11018 },
      { id: 'law', name: 'Law & Justice', lastPos: 5187 },
    ]
  },
  {
    id: 'just',
    shortName: 'JUST',
    fullName: 'Jashore University of Science and Technology',
    subjects: [
      { id: 'pharm', name: 'Pharmacy', lastPos: 517 },
      { id: 'micro', name: 'Microbiology', lastPos: 2112 },
      { id: 'gbt', name: 'Genetic Engineering & Biotechnology', lastPos: 1872 },
      { id: 'fmb', name: 'Fisheries & Marine Bioscience', lastPos: 3215 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 2193 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 386 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 521 },
      { id: 'bme', name: 'Biomedical Engineering', lastPos: 2699 },
      { id: 'ipe', name: 'Industrial & Production Engineering', lastPos: 1510 },
      { id: 'pme', name: 'Petroleum & Mining Engineering', lastPos: 3954 },
      { id: 'te', name: 'Textile Engineering', lastPos: 3114 },
      { id: 'che', name: 'Chemical Engineering', lastPos: 824 },
      { id: 'cdm', name: 'Climate & Disaster Management', lastPos: 12371 },
      { id: 'nft', name: 'Nutrition & Food Technology', lastPos: 4722 },
      { id: 'est', name: 'Environmental Science & Technology', lastPos: 5784 },
      { id: 'fe', name: 'Food Engineering', lastPos: 6853 },
      { id: 'pess', name: 'Physical Education & Sports Science', lastPos: 17 },
      { id: 'ptr', name: 'Physiotherapy', lastPos: 6748 },
      { id: 'nhs', name: 'Nursing & Health Science', lastPos: 11639 },
      { id: 'phy', name: 'Physics', lastPos: 6814 },
      { id: 'chem', name: 'Chemistry', lastPos: 3669 },
      { id: 'math', name: 'Mathematics', lastPos: 9890 },
      { id: 'asds', name: 'Applied Statistics & Data Science', lastPos: 3974 },
    ]
  },
  {
    id: 'pust',
    shortName: 'PUST',
    fullName: 'Pabna University of Science and Technology',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 3060 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 2757 },
      { id: 'eece', name: 'Electrical, Electronic & Communication Engineering', lastPos: 4661 },
      { id: 'ice', name: 'Information & Communication Engineering', lastPos: 4978 },
      { id: 'ce', name: 'Civil Engineering', lastPos: 4596 },
      { id: 'urp', name: 'Urban & Regional Planning', lastPos: 8629 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 2598 },
      { id: 'math', name: 'Mathematics', lastPos: 8330 },
      { id: 'che', name: 'Chemistry', lastPos: 6304 },
      { id: 'phy', name: 'Physics', lastPos: 8364 },
      { id: 'stats', name: 'Statistics', lastPos: 9000 },
      { id: 'arch', name: 'Architecture', lastPos: 9000 },
    ]
  },
  {
    id: 'brur',
    shortName: 'BRUR',
    fullName: 'Begum Rokeya University Rangpur',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4455 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 5420 },
      { id: 'phy', name: 'Physics', lastPos: 8700 },
      { id: 'chem', name: 'Chemistry', lastPos: 6970 },
      { id: 'math', name: 'Mathematics', lastPos: 9027 },
      { id: 'stats', name: 'Statistics', lastPos: 9427 },
      { id: 'dsm', name: 'Disaster Science & Management', lastPos: 11844 },
      { id: 'mcj', name: 'Mass Communication & Journalism', lastPos: 12590 },
      { id: 'gds', name: 'Gender & Development Studies', lastPos: 12946 },
      { id: 'soc', name: 'Sociology', lastPos: null },
      { id: 'mis', name: 'Management Information Systems', lastPos: 10782 },
      { id: 'mkt', name: 'Marketing', lastPos: null },
      { id: 'finance', name: 'Finance & Banking', lastPos: null },
      { id: 'mgt_studies', name: 'Management Studies', lastPos: null },
      { id: 'bangla', name: 'Bangla', lastPos: null },
      { id: 'english', name: 'English', lastPos: 10847 },
      { id: 'history', name: 'History', lastPos: 11561 },
      { id: 'ps', name: 'Political Science', lastPos: null },
      { id: 'pub_ad', name: 'Public Administration', lastPos: null },
      { id: 'geo', name: 'Geography', lastPos: 10850 },
    ]
  },
  {
    id: 'bsmrstu',
    shortName: 'GSTU',
    fullName: 'Gopalganj Science and Technology University',
    subjects: [
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 4875 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4588 },
      { id: 'acce', name: 'Applied Chemistry & Chemical Engineering', lastPos: 5543 },
      { id: 'ce', name: 'Civil Engineering', lastPos: 6200 },
      { id: 'fe', name: 'Food Engineering', lastPos: 7761 },
      { id: 'arch', name: 'Architecture', lastPos: null },
      { id: 'math', name: 'Mathematics', lastPos: 10124 },
      { id: 'phy', name: 'Physics', lastPos: 10500 },
      { id: 'stats', name: 'Statistics', lastPos: 9236 },
      { id: 'chem', name: 'Chemistry', lastPos: 8116 },
      { id: 'esd', name: 'Environmental Science & Disaster Management', lastPos: 10723 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 3106 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 5830 },
      { id: 'bge', name: 'Biotechnology & Genetic Engineering', lastPos: 5500 },
      { id: 'botany', name: 'Botany', lastPos: 11800 },
      { id: 'psych', name: 'Psychology', lastPos: 11930 },
      { id: 'ais', name: 'Accounting Information Systems', lastPos: 11234 },
      { id: 'mkt', name: 'Marketing', lastPos: 12393 },
      { id: 'fnb', name: 'Finance & Banking', lastPos: 12281 },
      { id: 'thm', name: 'Tourism & Hospitality Management', lastPos: 12307 },
      { id: 'eco', name: 'Economics', lastPos: 10021 },
      { id: 'soc', name: 'Sociological Studies', lastPos: 12000 },
      { id: 'ps', name: 'Political Science', lastPos: 11238 },
      { id: 'ir', name: 'International Relations', lastPos: 10001 },
      { id: 'english', name: 'English', lastPos: null },
      { id: 'law', name: 'Law', lastPos: null },
      { id: 'agri', name: 'Agriculture', lastPos: 5736 },
      { id: 'fmb', name: 'Fisheries & Marine Bioscience', lastPos: 7000 },
      { id: 'asvm', name: 'Animal Science & Veterinary Medicine', lastPos: 6755 },
    ]
  },
  {
    id: 'uft',
    shortName: 'UFTB',
    fullName: 'University of Frontier Technology Bangladesh',
    subjects: [
      { id: 'iot', name: 'Internet of Things and Robotics Engineering', lastPos: 11506 },
      { id: 'se', name: 'Software Engineering', lastPos: 9546 },
      { id: 'dse', name: 'Data Science Engineering', lastPos: 11971 },
      { id: 'cyber', name: 'Cyber Security Engineering', lastPos: 11196 },
      { id: 'edte', name: 'Educational Technology Engineering', lastPos: 12630 },
    ]
  },
  {
    id: 'sstu',
    shortName: 'SSTU',
    fullName: 'Sunamganj Science and Technology University',
    subjects: [
      { id: 'cse', name: 'Computer Science and Engineering', lastPos: 12228 },
      { id: 'chem', name: 'Chemistry', lastPos: 13213 },
      { id: 'math', name: 'Mathematics', lastPos: 15090 },
      { id: 'phy', name: 'Physics', lastPos: 15400 },
    ]
  },
  {
    id: 'bu',
    shortName: 'BU',
    fullName: 'University of Barishal, Barishal',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 5500 },
      { id: 'math', name: 'Mathematics', lastPos: 9500 },
      { id: 'phy', name: 'Physics', lastPos: 10200 },
      { id: 'chem', name: 'Chemistry', lastPos: 8800 },
      { id: 'geol', name: 'Geology & Mining', lastPos: 11500 },
      { id: 'botany', name: 'Botany', lastPos: 12000 },
    ]
  },
  {
    id: 'rmstu',
    shortName: 'RMSTU',
    fullName: 'Rangamati Science and Technology University, Rangamati',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 7500 },
      { id: 'fisheries', name: 'Fisheries & Marine Resource Technology', lastPos: 9800 },
      { id: 'fms', name: 'Forestry & Marine Science', lastPos: 10500 },
    ]
  },
  {
    id: 'nu',
    shortName: 'NEU',
    fullName: 'Netrokona University, Netrokona',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 11984 },
      { id: 'english', name: 'English', lastPos: 11853 },
      { id: 'eco', name: 'Economics', lastPos: 13200 },
      { id: 'ban', name: 'Bangla', lastPos: 13000 },
    ]
  },
  {
    id: 'bsfmstu',
    shortName: 'JSTU',
    fullName: 'Jamalpur Science and Technology University',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 6500 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 7800 },
      { id: 'math', name: 'Mathematics', lastPos: 11000 },
    ]
  },
  {
    id: 'cstu',
    shortName: 'CSTU',
    fullName: 'Chandpur Science and Technology University, Chandpur',
    subjects: [
      { id: 'ict', name: 'Information & Communication Technology', lastPos: 13749 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 12317 },
      { id: 'dba', name: 'Digital Banking & Analytics', lastPos: 4201 },
    ]
  },
  {
    id: 'kkust',
    shortName: 'KIU',
    fullName: 'Kishoreganj University',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 8500 },
      { id: 'math', name: 'Mathematics', lastPos: 12000 },
    ]
  },
  {
    id: 'prstu',
    shortName: 'PrSTU',
    fullName: 'Pirojpur Science & Technology University',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 12871 },
      { id: 'math', name: 'Mathematics', lastPos: 14651 },
      { id: 'psychology', name: 'Psychology', lastPos: 15562 },
      { id: 'stats', name: 'Statistics', lastPos: 14776 },
    ]
  },
  {
    id: 'naogaon_u',
    shortName: 'NAU',
    fullName: 'Naogaon university, Naogaon',
    subjects: [
      { id: 'law', name: 'Law', lastPos: null },
      { id: 'acc', name: 'Accounting', lastPos: null },
    ]
  },
   {
    id: 'rub',
    shortName: 'RUB',
    fullName: 'Rabindra university',
    subjects: [
      { id: 'ban', name: 'Bangla', lastPos: null },
      { id: 'eco', name: 'Economics', lastPos: null },
      { id: 'soc', name: 'Sociology', lastPos: null },
      { id: 'man', name: 'Management', lastPos: null },
    ]
  }
];

