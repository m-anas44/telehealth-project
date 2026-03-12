import { Type, FunctionDeclaration, Tool } from "@google/genai";

export const functions: FunctionDeclaration[] = [
    {
      name: "findDoctors",
      description:
        "Search for doctors based on specialty, bio and their experience.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          symptoms: {
            type: Type.STRING,
            description: "Symptoms described by the patient",
          },
          specialty: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "Medical specialty such as cardiologist, dentist, dermatologist",
          },
          experienceYears: {
            type: Type.NUMBER,
            description: "Number of years, the doctor has been servicing for",
          },
        },
      },
    },
    {
      name: "getDoctorDetails",
      description:
        "Retrieve detailed information about a specific doctor including their profile and clinic details.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          doctorId: {
            type: Type.STRING,
            description: "Unique identifier of the doctor",
          },
          day: {
            type: Type.STRING,
            description:
              "The date to check availability for (ISO format YYYY-MM-DD)",
          },
        },
        required: ["doctorId", "day"],
      },
    },
    {
      name: "getDoctorAvailability",
      description:
        "Retrieve available appointment time slots for a specific doctor.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          doctorId: {
            type: Type.STRING,
          },
        },
        required: ["doctorId"],
      },
    },
    {
      name: "bookAppointment",
      description: "Book an appointment with a doctor at a specific time.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          doctorId: { type: Type.STRING },
          day: {
            type: Type.STRING,
            description: "The confirmed date (ISO format)",
          },
          time: {
            type: Type.STRING,
            description: "The confirmed time (ISO format)",
          },
          type: {
            type: Type.STRING,
            enum: ["phone", "in-person", "online"],
            description: "The confirmed appointment type",
          },
        },
        required: ["doctorId", "day", "time", "type"],
      },
    },
  ]

export const appointmentTools: Tool = {
  functionDeclarations: functions,
};