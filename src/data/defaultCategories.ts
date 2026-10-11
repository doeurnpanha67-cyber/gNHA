export interface CategoryDefinition {
  id: string;
  nameEnglish: string;
  nameKhmer: string;
  descriptionKhmer: string;
  visualIconName: string;
}

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'interesting-facts',
    nameEnglish: 'Interesting facts people do not know',
    nameKhmer: 'ការពិតគួរឱ្យចាប់អារម្មណ៍ដែលមនុស្សមិនដឹង',
    descriptionKhmer: 'រឿងរ៉ាវប្លែកៗ កម្រនឹងឮ និងការពិតវិទ្យាសាស្ត្រដែលភ្ញាក់ផ្អើល',
    visualIconName: 'Sparkles',
  },
  {
    id: 'everyday-explained',
    nameEnglish: 'Everyday things explained',
    nameKhmer: 'ការពន្យល់អំពីរឿងរ៉ាវជុំវិញខ្លួនប្រចាំថ្ងៃ',
    descriptionKhmer: 'ហេតុអ្វីបានជាវត្ថុ ឬបាតុភូតដែលយើងជួបប្រចាំថ្ងៃដំណើរការបែបនេះ?',
    visualIconName: 'HelpCircle',
  },
  {
    id: 'science-tech',
    nameEnglish: 'Science and technology',
    nameKhmer: 'វិទ្យាសាស្ត្រ និងបច្ចេកវិទ្យា',
    descriptionKhmer: 'របកគំហើញ AI អវកាស និងបច្ចេកវិទ្យាទំនើបៗជុំវិញពិភពលោក',
    visualIconName: 'Cpu',
  },
  {
    id: 'history-ancient',
    nameEnglish: 'History and ancient civilizations',
    nameKhmer: 'ប្រវត្តិសាស្ត្រ និងអារ្យធម៌បុរាណ',
    descriptionKhmer: 'រឿងរ៉ាវអាណាចក្របុរាណ រ៉ូម អេហ្ស៊ីប និងមេរៀនប្រវត្តិសាស្ត្រពិភពលោក',
    visualIconName: 'Landmark',
  },
  {
    id: 'cambodian-culture',
    nameEnglish: 'Cambodian history and culture',
    nameKhmer: 'ប្រវត្តិសាស្ត្រ និងវប្បធម៌ខ្មែរ',
    descriptionKhmer: 'សម័យមហានគរ ប្រាសាទបុរាណ សិល្បៈ ទំនៀមទម្លាប់ និងមរតកដូនតាខ្មែរ',
    visualIconName: 'Castle',
  },
  {
    id: 'construction-home',
    nameEnglish: 'Construction knowledge and home improvement',
    nameKhmer: 'ចំណេះដឹងសំណង់ និងការកែលម្អផ្ទះ',
    descriptionKhmer: 'បច្ចេកទេសសង់ផ្ទះ គ្រឹះរឹងមាំ ការរចនា និងការដោះស្រាយបញ្ហាជ្រាបទឹក',
    visualIconName: 'Hammer',
  },
  {
    id: 'psychology-behavior',
    nameEnglish: 'Psychology and human behavior',
    nameKhmer: 'ចិត្តវិទ្យា និងអាកប្បកិរិយាមនុស្ស',
    descriptionKhmer: 'ការអានចិត្តមនុស្ស ទំនាក់ទំនងសង្គម និងការយល់ពីអារម្មណ៍ខ្លួនឯង',
    visualIconName: 'Brain',
  },
  {
    id: 'life-lessons',
    nameEnglish: 'Life lessons and personal development',
    nameKhmer: 'មេរៀនជីវិត និងការអភិវឌ្ឍខ្លួន',
    descriptionKhmer: 'ទម្លាប់ល្អៗ ផ្នត់គំនិតជោគជ័យ និងការគ្រប់គ្រងពេលវេលា',
    visualIconName: 'Compass',
  },
  {
    id: 'mysteries-unexplained',
    nameEnglish: 'Mysteries and unexplained events',
    nameKhmer: 'អាថ៌កំបាំង និងព្រឹត្តិការណ៍មិនអាចពន្យល់បាន',
    descriptionKhmer: 'ការបាត់ខ្លួនអាថ៌កំបាំង សំណង់ចម្លែក និងបាតុភូតធម្មជាតិអស្ចារ្យ',
    visualIconName: 'Eye',
  },
  {
    id: 'educational-content',
    nameEnglish: 'Educational content',
    nameKhmer: 'ខ្លឹមសារអប់រំ និងចំណេះដឹងទូទៅ',
    descriptionKhmer: 'ចំណេះដឹងភូមិសាស្ត្រ ច្បាប់ សេដ្ឋកិច្ច និងព័ត៌មានមានប្រយោជន៍',
    visualIconName: 'GraduationCap',
  },
  {
    id: 'business-marketing',
    nameEnglish: 'Business and marketing',
    nameKhmer: 'អាជីវកម្ម និងទីផ្សារ',
    descriptionKhmer: 'យុទ្ធសាស្ត្ររកស៊ី ការលក់ ការបង្កើតម៉ាកយីហោ និងការគ្រប់គ្រងហិរញ្ញវត្ថុ',
    visualIconName: 'TrendingUp',
  },
  {
    id: 'health-wellness',
    nameEnglish: 'Health and general wellness education',
    nameKhmer: 'សុខភាព និងការថែទាំសុខុមាលភាព',
    descriptionKhmer: 'ការហូបចុកត្រឹមត្រូវ ដំណេក ការហាត់ប្រាណ និងការការពារជំងឺ',
    visualIconName: 'Activity',
  },
  {
    id: 'world-discoveries',
    nameEnglish: 'World discoveries and unusual facts',
    nameKhmer: 'ការរកឃើញពិភពលោក និងរឿងចម្លែកៗ',
    descriptionKhmer: 'រូងភ្នំជ្រៅ បាតមហាសមុទ្រ សត្វចម្លែក និងការរុករកពិភពលោក',
    visualIconName: 'Globe',
  },
  {
    id: 'storytelling-real',
    nameEnglish: 'Storytelling and real-world experiences',
    nameKhmer: 'ការនិទានរឿង និងបទពិសោធន៍ពិត',
    descriptionKhmer: 'ដំណើរជីវិតមនុស្សពិត ឧបសគ្គ និងរឿងរ៉ាវបំផុសគំនិតប្រកបដោយមនោសញ្ចេតនា',
    visualIconName: 'BookOpen',
  },
];
