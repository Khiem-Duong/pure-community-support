INSERT OR IGNORE INTO campaigns (id, title, title_vi, status, focus, location, format, summary, about, covers, shown, sort_order) VALUES (
  'food-essentials',
  'Community Food & Essentials Kit',
  'Bộ thực phẩm & nhu yếu phẩm cộng đồng',
  'running',
  'Living conditions',
  'Hue, Thừa Thiên Huế',
  'Recurring distribution (schedule TBD)',
  'Regular provision of food staples and household essentials to families in Hue, identified through local community partners.',
  'The programme provides kits of food staples and everyday household items to families referred by community authority heads and local partners in Hue. Contents are sourced locally wherever possible.' || char(10) || char(10) ||
  'Distribution is ongoing, with no funding target. Each quarter, the number of kits provided and the amount allocated are recorded and published in the transparency report.',
  'Rice, cooking oil and other food staples' || char(10) || 'Hygiene and household essentials' || char(10) || 'Locally sourced contents where possible',
  1, 0);

INSERT OR IGNORE INTO campaigns (id, title, title_vi, status, focus, location, format, summary, about, covers, shown, sort_order) VALUES (
  'lotus-art',
  'Lotus Art for Healing Workshop',
  'Hội thảo nghệ thuật hoa sen chữa lành',
  'running',
  'Health & wellbeing',
  'Hue, Thừa Thiên Huế',
  'Workshop series (dates TBD)',
  'Art workshops built around the lotus, a traditional motif of Hue, supporting wellbeing and community connection.',
  'Participants work with painting and drawing techniques centred on the lotus, a motif closely tied to the culture of Hue. Sessions are led by local artists and run in small groups.' || char(10) || char(10) ||
  'Materials are provided for each session. Attendance and costs are recorded and included in the quarterly transparency report.',
  'Guided painting and drawing sessions' || char(10) || 'All art materials provided' || char(10) || 'Small groups led by local artists',
  1, 1);

INSERT OR IGNORE INTO campaigns (id, title, title_vi, status, focus, location, format, summary, about, covers, shown, sort_order) VALUES (
  'youth-leadership',
  'Youth Leadership Circle',
  'Vòng tròn lãnh đạo trẻ',
  'running',
  'Education',
  'Hue, Thừa Thiên Huế',
  'Regular mentoring sessions (schedule TBD)',
  'Mentoring and skills development for young people in Hue, with a focus on education, confidence and community responsibility.',
  'The circle brings participants together with volunteer mentors for structured sessions on study skills, communication and planning. Participants are referred through school principals and community partners.' || char(10) || char(10) ||
  'The programme runs continuously. Session numbers and programme costs are reported each quarter.',
  'Study skills and learning support' || char(10) || 'Communication and planning workshops' || char(10) || 'Mentoring by trained volunteers',
  1, 2);

INSERT OR IGNORE INTO campaigns (id, title, title_vi, status, focus, location, format, summary, about, covers, shown, sort_order) VALUES (
  'heritage-craft',
  'Heritage Craft Class with Local Artisans',
  'Lớp thủ công truyền thống cùng nghệ nhân địa phương',
  'planned',
  'Cultural heritage',
  'Hue, Thừa Thiên Huế',
  'Class series (start date TBD)',
  'A planned programme in which local artisans teach traditional Hue craft skills to members of the community.',
  'Classes will be taught by artisans from the Pure network and cover techniques such as conical hat making, weaving and embroidery. The aim is to keep these skills in active use in Hue.' || char(10) || char(10) ||
  'The programme is in planning. Its start date, schedule and participating artisans will be announced on this page.',
  'Conical hat making, weaving and embroidery' || char(10) || 'Taught by artisans from the Pure network' || char(10) || 'Materials and tools provided',
  1, 3);
