import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processQuizSchema, type QuizResult } from "@shared/schema";
import { z } from "zod";

// Import quiz processing logic
const enneagramTypes = {
  1: { 
    name: "นักปฏิรูป", 
    englishName: "Reformer", 
    traits: ["หลักการ", "ความสมบูรณ์แบบ", "ความรับผิดชอบ"],
    description: "คุณเป็นคนที่มีหลักการและมีจิตสำนึกสูง มักจะมองเห็นสิ่งที่ควรปรับปรุงและต้องการทำให้ทุกอย่างดีขึ้น คุณมีความรู้สึกรับผิดชอบสูงและมักจะเป็นแรงบันดาลใจให้คนอื่น",
    strengths: ["มีหลักการที่แน่วแน่", "ความรับผิดชอบสูง", "มีวิสัยทัศน์ในการปรับปรุง", "เชื่อถือได้และไว้วางใจได้"],
    growthAreas: ["ควรผ่อนคลายความเครียด", "เรียนรู้การยอมรับข้อบกพร่อง", "ฝึกความอดทนกับผู้อื่น", "หาสมดุลระหว่างงานและชีวิต"]
  },
  2: { 
    name: "ผู้ช่วยเหลือ", 
    englishName: "Helper", 
    traits: ["การช่วยเหลือ", "ความเอื้ออาทร", "การให้"],
    description: "คุณเป็นคนที่อบอุ่นและใส่ใจผู้อื่น มักจะเข้าใจความต้องการของคนรอบข้างและพร้อมให้ความช่วยเหลือเสมอ คุณมีความสามารถในการสร้างความสัมพันธ์ที่ดีกับผู้อื่น",
    strengths: ["มีความเห็นอกเห็นใจสูง", "เข้าใจความรู้สึกผู้อื่น", "สร้างความสัมพันธ์ได้ดี", "ใจดีและเสียสละ"],
    growthAreas: ["เรียนรู้การดูแลตัวเอง", "ตั้งขอบเขตที่ชัดเจน", "ยอมรับความต้องการของตนเอง", "หลีกเลี่ยงการให้มากเกินไป"]
  },
  3: { 
    name: "นักสู้เพื่อความสำเร็จ", 
    englishName: "Achiever", 
    traits: ["ความสำเร็จ", "ประสิทธิภาพ", "ภาพลักษณ์"],
    description: "คุณเป็นคนที่มีความมุ่งมั่นสูงและชอบความท้าทาย มักจะตั้งเป้าหมายที่ชัดเจนและทำงานอย่างหนักเพื่อให้บรรลุ คุณมีทักษะในการโน้มน้าวและสร้างแรงบันดาลใจให้ผู้อื่น",
    strengths: ["มีความมุ่งมั่นสูง", "ทำงานได้อย่างมีประสิทธิภาพ", "สร้างแรงบันดาลใจได้", "ปรับตัวได้ดี"],
    growthAreas: ["หาเวลาสำหรับตัวเอง", "เรียนรู้การยอมรับความล้มเหลว", "สร้างความสัมพันธ์ที่แท้จริง", "หลีกเลี่ยงการทำงานหนักเกินไป"]
  },
  4: { 
    name: "นักสร้างสรรค์", 
    englishName: "Individualist", 
    traits: ["ความเป็นตัวตน", "ความสร้างสรรค์", "อารมณ์ลึกซึ้ง"],
    description: "คุณเป็นคนที่มีความเป็นตัวตนที่ชัดเจนและมีความสร้างสรรค์สูง มักจะมองหาความหมายลึกซึ้งในสิ่งต่างๆ และต้องการแสดงออกถึงความเป็นเอกลักษณ์ของตนเอง",
    strengths: ["มีความคิดสร้างสรรค์", "เข้าใจอารมณ์ความรู้สึกลึกซึ้ง", "มีความเป็นตัวตนที่แข็งแกร่ง", "มองเห็นความงามในสิ่งต่างๆ"],
    growthAreas: ["ควบคุมอารมณ์ให้ดีขึ้น", "หลีกเลี่ยงการเปรียบเทียบตนเองกับผู้อื่น", "เรียนรู้การยอมรับความธรรมดา", "สร้างความมั่นคงทางอารมณ์"]
  },
  5: { 
    name: "นักสืบค้น", 
    englishName: "Investigator", 
    traits: ["ความรู้", "การวิเคราะห์", "การสังเกต"],
    description: "คุณเป็นคนที่มีความอยากรู้อยากเห็นสูงและชอบการเรียนรู้สิ่งใหม่ๆ มักจะใช้เวลาในการสังเกตและวิเคราะห์ก่อนตัดสินใจ คุณมีความสามารถในการคิดอย่างเป็นระบบ",
    strengths: ["มีความรู้ลึกซึ้ง", "คิดวิเคราะห์ได้ดี", "เป็นคนสังเกต", "มีความเป็นอิสระ"],
    growthAreas: ["เรียนรู้การแบ่งปันความรู้", "สร้างความสัมพันธ์กับผู้อื่น", "หลีกเลี่ยงการหลีกเลี่ยงสังคม", "ฝึกการแสดงอารมณ์"]
  },
  6: { 
    name: "ผู้ภักดี", 
    englishName: "Loyalist", 
    traits: ["ความภักดี", "ความปลอดภัย", "การเตรียมพร้อม"],
    description: "คุณเป็นคนที่มีความภักดีสูงและเชื่อถือได้ มักจะคิดล่วงหน้าและเตรียมพร้อมสำหรับสถานการณ์ต่างๆ คุณมีความสามารถในการทำงานเป็นทีมและสร้างความไว้วางใจ",
    strengths: ["มีความภักดี", "เชื่อถือได้", "คิดล่วงหน้า", "ทำงานเป็นทีมได้ดี"],
    growthAreas: ["สร้างความมั่นใจในตนเอง", "หลีกเลี่ยงการกังวลมากเกินไป", "เรียนรู้การตัดสินใจด้วยตนเอง", "ฝึกการเสี่ยง"]
  },
  7: { 
    name: "ผู้ชื่นชอบการผจญภัย", 
    englishName: "Enthusiast", 
    traits: ["ความสนุกสนาน", "การผจญภัย", "ความเป็นไปได้"],
    description: "คุณเป็นคนที่มีพลังสูงและมองโลกในแง่ดี มักจะสนใจในสิ่งใหม่ๆ และชอบการผจญภัย คุณมีความสามารถในการสร้างความสนุกสนานและแรงบันดาลใจให้ผู้อื่น",
    strengths: ["มีพลังและความกระตือรือร้น", "มองโลกในแง่ดี", "ปรับตัวได้ดี", "สร้างความสนุกสนาน"],
    growthAreas: ["เรียนรู้การมีสมาธิ", "ทำสิ่งต่างๆให้เสร็จสิ้น", "หลีกเลี่ยงการหลบหนีปัญหา", "ฝึกความอดทน"]
  },
  8: { 
    name: "ผู้ท้าทาย", 
    englishName: "Challenger", 
    traits: ["ความแข็งแกร่ง", "การควบคุม", "ความตรงไปตรงมา"],
    description: "คุณเป็นคนที่มีความแข็งแกร่งและมั่นใจในตนเอง มักจะเป็นผู้นำธรรมชาติและไม่กลัวที่จะเผชิญหน้ากับความท้าทาย คุณมีความสามารถในการปกป้องและต่อสู้เพื่อสิ่งที่ถูกต้อง",
    strengths: ["มีความแข็งแกร่ง", "เป็นผู้นำที่ดี", "ตรงไปตรงมา", "ปกป้องผู้อื่น"],
    growthAreas: ["เรียนรู้การยับยั้งชั่งใจ", "ฟังความคิดเห็นผู้อื่น", "หลีกเลี่ยงการควบคุมมากเกินไป", "ฝึกความอ่อนโยน"]
  },
  9: { 
    name: "นักสร้างสันติ", 
    englishName: "Peacemaker", 
    traits: ["ความสงบ", "ความสามัคคี", "การยอมรับ"],
    description: "คุณเป็นคนที่รักสงบและต้องการความสามัคคี มักจะเป็นผู้ไกล่เกลี่ยและช่วยให้คนอื่นเข้าใจกัน คุณมีความสามารถในการมองเห็นมุมมองที่หลากหลายและยอมรับความแตกต่าง",
    strengths: ["สร้างความสามัคคี", "เป็นผู้ไกล่เกลี่ยที่ดี", "ยอมรับความแตกต่าง", "มีความอดทน"],
    growthAreas: ["เรียนรู้การแสดงความคิดเห็น", "ตั้งเป้าหมายที่ชัดเจน", "หลีกเลี่ยงการผัดวันประกันพรุ่ง", "ฝึกความมุ่งมั่น"]
  }
};

function calculatePersonalityType(answers: Record<string, string>): number {
  const scores: Record<number, number> = {};
  
  // Initialize scores
  for (let i = 1; i <= 9; i++) {
    scores[i] = 0;
  }
  
  // Calculate scores based on answers
  // This is a simplified scoring system - in reality, you'd have more complex logic
  Object.values(answers).forEach((answer, index) => {
    // Mock scoring logic - you would implement the actual scoring from the original script.js
    const questionNumber = index + 1;
    
    // Add mock scoring logic here
    if (answer === 'A') {
      scores[1] += 2;
      scores[8] += 1;
    } else if (answer === 'B') {
      scores[2] += 2;
      scores[6] += 1;
    } else if (answer === 'C') {
      scores[4] += 2;
      scores[7] += 1;
    } else if (answer === 'D') {
      scores[5] += 2;
      scores[9] += 1;
    }
  });
  
  // Find the highest scoring type
  let maxScore = 0;
  let personalityType = 1;
  
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      personalityType = parseInt(type);
    }
  }
  
  return personalityType;
}

function getRelatedCharacters(type: number): Array<{type: number; name: string; englishName: string}> {
  // Return 2-3 related character types
  const related = [];
  const typeNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(t => t !== type);
  
  for (let i = 0; i < Math.min(3, typeNumbers.length); i++) {
    const relatedType = typeNumbers[i];
    const typeData = enneagramTypes[relatedType as keyof typeof enneagramTypes];
    related.push({
      type: relatedType,
      name: typeData.name,
      englishName: typeData.englishName
    });
  }
  
  return related;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Quiz processing endpoint
  app.post("/api/process-quiz", async (req, res) => {
    try {
      const { answers, sessionId } = processQuizSchema.parse(req.body);
      
      // Create quiz session
      await storage.createQuizSession({ sessionId, answers });
      
      // Calculate personality type
      const personalityType = calculatePersonalityType(answers);
      const typeData = enneagramTypes[personalityType as keyof typeof enneagramTypes];
      
      if (!typeData) {
        return res.status(400).json({ message: "Invalid personality type calculated" });
      }
      
      // Create result object
      const result: QuizResult = {
        type: personalityType,
        name: typeData.name,
        englishName: typeData.englishName,
        traits: typeData.traits,
        description: typeData.description,
        strengths: typeData.strengths,
        growthAreas: typeData.growthAreas,
        relatedCharacters: getRelatedCharacters(personalityType)
      };
      
      // Update session with results
      const updatedSession = await storage.updateQuizSession(sessionId, result);
      
      if (!updatedSession) {
        return res.status(500).json({ message: "Failed to save quiz results" });
      }
      
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      
      console.error("Quiz processing error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get quiz session results
  app.get("/api/quiz-session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getQuizSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Quiz session not found" });
      }
      
      res.json(session);
    } catch (error) {
      console.error("Get session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
