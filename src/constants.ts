/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UniversityInfo } from './types';

export const INITIAL_UNIVERSITIES: UniversityInfo[] = [
  {
    id: 'iu',
    shortName: 'IU',
    fullName: 'Islamic University, Kushtia',
    subjects: [
      { id: 'acce', name: 'Applied Chemistry & Chemical Engineering', lastPos: 1340 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 2158 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: '1700+' },
      { id: 'ict', name: 'Information & Communication Technology', lastPos: 2711 },
      { id: 'bme', name: 'Biomedical Engineering', lastPos: 3914 },
      { id: 'anft', name: 'Applied Nutrition & Food Technology', lastPos: 4800 },
      { id: 'btge', name: 'Biotechnology & Genetic Engineering', lastPos: 2400 },
      { id: 'pharm', name: 'Pharmacy', lastPos: '1500+' },
      { id: 'math', name: 'Mathematics', lastPos: 8397 },
      { id: 'sds', name: 'Statistics', lastPos: 5500 },
      { id: 'esg', name: 'Environmental Science & Geography', lastPos: 11967 },
    ]
  },
  {
    id: 'mbstu',
    shortName: 'MBSTU',
    fullName: 'Mawlana Bhashani Science and Technology University, Tangail',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 478 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 320 },
      { id: 'ict', name: 'Information & Communication Technology', lastPos: 1199 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 858 },
      { id: 'te', name: 'Textile Engineering', lastPos: 2192 },
      { id: 'bge', name: 'Biotechnology & Genetic Engineering', lastPos: 1546 },
      { id: 'me', name: 'Mechanical Engineering', lastPos: 2516 },
      { id: 'phy', name: 'Physics', lastPos: 6171 },
      { id: 'chem', name: 'Chemistry', lastPos: 3011 },
      { id: 'ftns', name: 'Food Technology & Nutritional Science', lastPos: 3019 },
      { id: 'cps', name: 'Criminology & Police Science', lastPos: 5728 },
      { id: 'math', name: 'Mathematics', lastPos: 5500 },
      { id: 'esrm', name: 'Environmental Science & Resource Management', lastPos: 4427 },
      { id: 'stats', name: 'Statistics', lastPos: 6027 },
    ]
  },
  {
    id: 'pstu',
    shortName: 'PSTU',
    fullName: 'Patuakhali Science And Technology University, Patuakhali',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4522 },
      { id: 'nfs', name: 'Nutrition & Food Science', lastPos: 8250 },
      { id: 'esdm', name: 'Environmental Science & Disaster Management', lastPos: 10206 },
    ]
  },
  {
    id: 'nstu',
    shortName: 'NSTU',
    fullName: 'Noakhali Science and Technology University, Noakhali',
    subjects: [
      { id: 'pharm', name: 'Pharmacy', lastPos: 555 },
      { id: 'cste', name: 'Computer Science & Telecommunication Engineering', lastPos: 1312 },
      { id: 'acce', name: 'Applied Chemistry & Chemical Engineering', lastPos: 1840 },
      { id: 'fmb', name: 'Fisheries & Marine Science', lastPos: 5898 },
      { id: 'micro', name: 'Microbiology', lastPos: 2348 },
      { id: 'bge', name: 'Biotechnology & Genetic Engineering', lastPos: 3499 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 3503 },
      { id: 'ice', name: 'Information & Communication Engineering', lastPos: 3773 },
      { id: 'agri', name: 'Agriculture', lastPos: 3754 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 3002 },
      { id: 'math', name: 'Mathematics', lastPos: 2988 },
      { id: 'amath', name: 'Applied Mathematics', lastPos: 6693 },
      { id: 'stat', name: 'Statistics', lastPos: 7300 },
      { id: 'ftns', name: 'Food Technology & Nutritional Science', lastPos: 7811 },
      { id: 'che', name: 'Chemistry', lastPos: 6304 },
      { id: 'phy', name: 'Physics', lastPos: 7421 },
      { id: 'esrm', name: 'Environmental Science & Resource Management', lastPos: 8968 },
      { id: 'ocean', name: 'Oceanography', lastPos: 8188 },
      { id: 'zoo', name: 'Zoology', lastPos: 8968 },
    ]
  },
  {
    id: 'jkkniu',
    shortName: 'JKKNIU',
    fullName: 'Jatiya Kabi Kazi Nazrul Islam University, Mymensingh',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 1340 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 2153 },
      { id: 'env', name: 'Environmental Science & Engineering', lastPos: 4111 },
      { id: 'stats', name: 'Statistics', lastPos: 8665 },
      { id: 'math', name: 'Mathematics', lastPos: 8530 },
    ]
  },
  {
    id: 'just',
    shortName: 'JUST',
    fullName: 'Jashore University of Science and Technology, Jashore',
    subjects: [
      { id: 'pharm', name: 'Pharmacy', lastPos: 517 },
      { id: 'micro', name: 'Microbiology', lastPos: 2112 },
      { id: 'gebt', name: 'Genetic Engineering & Biotechnology', lastPos: 1872 },
      { id: 'fmb', name: 'Fisheries & Marine Bioscience', lastPos: 3215 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 2193 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 386 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 521 },
      { id: 'ipe', name: 'Industrial & Production Engineering', lastPos: 2699 },
      { id: 'bme', name: 'Biomedical Engineering', lastPos: 1510 },
      { id: 'pme', name: 'Petroleum & Mining Engineering', lastPos: 3954 },
      { id: 'te', name: 'Textile Engineering', lastPos: 3114 },
      { id: 'che', name: 'Chemical Engineering', lastPos: 824 },
      { id: 'cdm', name: 'Climate & Disaster Management', lastPos: 12371 },
      { id: 'nft', name: 'Nutrition & Food Technology', lastPos: 4722 },
      { id: 'est', name: 'Environmental Science & Technology', lastPos: 5784 },
      { id: 'agri', name: 'Agriculture', lastPos: 6853 },
      { id: 'phy', name: 'Physics', lastPos: 6814 },
      { id: 'chem', name: 'Chemistry', lastPos: 3669 },
      { id: 'math', name: 'Mathematics', lastPos: 9890 },
      { id: 'asds', name: 'Applied Statistics & Data Science', lastPos: 3974 },
    ]
  },
  {
    id: 'pust',
    shortName: 'PUST',
    fullName: 'Pabna University of Science and Technology, Pabna',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 3060 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 2757 },
      { id: 'eece', name: 'Electrical, Electronic & Communication Engineering', lastPos: 4661 },
      { id: 'ice', name: 'Information & Communication Engineering', lastPos: 4978 },
      { id: 'ce', name: 'Civil Engineering', lastPos: 4596 },
      { id: 'urp', name: 'Urban & Regional Planning', lastPos: 8629 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 2508 },
      { id: 'math', name: 'Mathematics', lastPos: 8330 },
      { id: 'phy', name: 'Physics', lastPos: 6304 },
      { id: 'chem', name: 'Chemistry', lastPos: 8364 },
      { id: 'arch', name: 'Architecture', lastPos: '9k Exam' },
    ]
  },
  {
    id: 'brur',
    shortName: 'BRUR',
    fullName: 'Begum Rokeya University, Rangpur',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4455 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 5420 },
      { id: 'phy', name: 'Physics', lastPos: 8700 },
      { id: 'chem', name: 'Chemistry', lastPos: 6970 },
      { id: 'math', name: 'Mathematics', lastPos: 9027 },
      { id: 'stats', name: 'Statistics', lastPos: 9427 },
      { id: 'dsm', name: 'Disaster Management', lastPos: 11844 },
    ]
  },
  {
    id: 'bsmrstu',
    shortName: 'BSMRSTU',
    fullName: 'Gopalganj Science & Technology University',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4588 },
      { id: 'eee', name: 'Electrical & Electronic Engineering', lastPos: 4875 },
      { id: 'acce', name: 'Applied Chemistry & Chemical Engineering', lastPos: 5543 },
      { id: 'ce', name: 'Civil Engineering', lastPos: 6200 },
      { id: 'fe', name: 'Food Engineering', lastPos: 7761 },
      { id: 'arch', name: 'Architecture', lastPos: 132 },
      { id: 'pharm', name: 'Pharmacy', lastPos: 3104 },
      { id: 'bmb', name: 'Biochemistry & Molecular Biology', lastPos: 5830 },
      { id: 'bge', name: 'Biotechnology & Genetic Engineering', lastPos: 5500 },
      { id: 'botany', name: 'Botany', lastPos: '11800+' },
      { id: 'agri', name: 'Agriculture', lastPos: 5736 },
      { id: 'fisheries', name: 'Fisheries & Marine Bioscience', lastPos: 7000 },
      { id: 'asvm', name: 'Animal Science & Veterinary Medicine', lastPos: 6755 },
      { id: 'esd', name: 'Environmental Science & Disaster Management', lastPos: 10422 },
      { id: 'phy', name: 'Physics', lastPos: 10500 },
      { id: 'stats', name: 'Statistics', lastPos: 9434 },
      { id: 'chem', name: 'Chemistry', lastPos: '8600+' },
      { id: 'math', name: 'Mathematics', lastPos: 10124 },
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
    id: 'rub',
    shortName: 'RUB',
    fullName: 'Rabindra University, Bangladesh',
    subjects: [
      { id: 'eco', name: 'Economics', lastPos: 8500 },
      { id: 'management', name: 'Management', lastPos: 11000 },
    ]
  },
  {
    id: 'uft',
    shortName: 'UFT',
    fullName: 'University of Frontier Technology, Bangladesh',
    subjects: [
      { id: 'iot', name: 'Internet of Things (IoT) & Robotics Engineering', lastPos: 11506 },
      { id: 'se', name: 'Software Engineering', lastPos: 9546 },
      { id: 'dse', name: 'Data Science Engineering', lastPos: 11971 },
      { id: 'cyber', name: 'Cyber Security Engineering', lastPos: 11196 },
      { id: 'edte', name: 'Educational Technology Engineering', lastPos: 12630 },
    ]
  },
  {
    id: 'nu',
    shortName: 'NU',
    fullName: 'Netrokona University, Netrokona',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 4920 },
      { id: 'english', name: 'English', lastPos: 13200 },
      { id: 'eco', name: 'Economics', lastPos: 11200 },
    ]
  },
  {
    id: 'bsfmstu',
    shortName: 'BSFMSTU',
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
    shortName: 'KkUST',
    fullName: 'Kishoreganj University',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 8500 },
      { id: 'math', name: 'Mathematics', lastPos: 12000 },
    ]
  },
  {
    id: 'sstu',
    shortName: 'SSTU',
    fullName: 'Sunamgonj Science and Technology University, Sunamgonj',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 12228 },
      { id: 'chem', name: 'Chemistry', lastPos: 13213 },
      { id: 'math', name: 'Mathematics', lastPos: 15090 },
      { id: 'phy', name: 'Physics', lastPos: 15400 },
    ]
  },
  {
    id: 'prstu',
    shortName: 'PSTU',
    fullName: 'Pirojpur Science & Technology University',
    subjects: [
      { id: 'psychology', name: 'Psychology', lastPos: 15562 },
      { id: 'stats', name: 'Statistics', lastPos: 14776 },
      { id: 'math', name: 'Mathematics', lastPos: 14651 },
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 12871 },
    ]
  },
  {
    id: 'naogaon_u',
    shortName: 'NU',
    fullName: 'Naogaon university, Naogaon',
    subjects: [
      { id: 'cse', name: 'Computer Science & Engineering', lastPos: 11000 },
      { id: 'math', name: 'Mathematics', lastPos: 14500 },
    ]
  }
];
