import { Appointment } from "@/models/appointment";
import { DoctorProfile } from "@/models/doctorProfile";

export async function findDoctors(args: any) {
  try {
    const { symptoms, specialty, experienceYears } = args;
    const foundDoctors = await DoctorProfile.find({
      ...(specialty && { specialization: { $in: specialty } }),
      ...(experienceYears && { experienceYears: { $gte: experienceYears } }),
    })
      .populate("userId", "name image city")
      .lean()
      .limit(5);

    return { success: true, doctors: foundDoctors };
  } catch (error: any) {
    console.error("An error occured while finding doctor: ", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getDoctorDetails({ doctorId }: any) {
  try {
    const doctorDetails = await DoctorProfile.findById(doctorId)
      .select(
        "userId specialization experienceYears bio isActive consultationTypes availability clinicalAddress bufferTime consultationDuration",
      )
      .populate("userId", "name image city")
      .lean();

    return { success: true, doctor: doctorDetails };
  } catch (error: any) {
    console.error("An error occured while fetching doctor details: ", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

export async function getDoctorAvailability({
  doctorId, // Make sure this is the ID used in Appointments
  day,
}: {
  doctorId: string;
  day: string;
}) {
  try {
    const targetDate = new Date(day);
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(targetDate);

    // Fix 1: Independent Start/End Dates to avoid mutation
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const [profile, bookedAppointments] = await Promise.all([
      DoctorProfile.findOne({ userId: doctorId }) // Check: Is this userId or _id?
        .select("availability consultationDuration bufferTime isActive")
        .lean(),
      Appointment.find({
        doctorId: doctorId, 
        day: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["confirmed", "pending"] },
      })
        .select("time")
        .lean(),
    ]);

    if (!profile || !profile.isActive) return { error: "Doctor unavailable" };

    const dayConfig = profile.availability?.weekly.find(
      (d) => d.day === dayName && d.isAvailable
    );
    
    if (!dayConfig || !dayConfig.startTime || !dayConfig.endTime) {
       return { message: `Closed on ${dayName}`, slots: [] };
    }

    // Fix 2: Explicit Time Formatting (Avoid toLocaleTimeString inconsistencies)
    const bookedSet = new Set(
      bookedAppointments.map((a) => {
        const d = new Date(a.time);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      })
    );

    const freeSlots: string[] = [];
    const [sH, sM] = dayConfig.startTime.split(":").map(Number);
    const [eH, eM] = dayConfig.endTime.split(":").map(Number);

    let currentTotalMin = sH * 60 + sM;
    const endTotalMin = eH * 60 + eM;
    const step = profile.consultationDuration + (profile.bufferTime || 0);

    while (currentTotalMin + profile.consultationDuration <= endTotalMin) {
      const hh = Math.floor(currentTotalMin / 60).toString().padStart(2, "0");
      const mm = (currentTotalMin % 60).toString().padStart(2, "0");
      const timeStr = `${hh}:${mm}`;

      if (!bookedSet.has(timeStr)) {
        freeSlots.push(timeStr);
      }
      currentTotalMin += step;
    }

    return { success: true, slots: freeSlots };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function bookAppointment({
  doctorId,
  day,
  time,
  type,
  patientId,
}: any) {
  try {
    if (!doctorId || !day || !time || !type || !patientId) {
      return { success: false, message: "Missing required booking details." };
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      day: new Date(day),
      time: new Date(time),
      type,
      status: "pending",
    });

    return {
      success: true,
      appointmentId: appointment._id.toString(),
      message:
        "Appointment has been successfully booked and is currently pending.",
    };
  } catch (error: any) {
    console.error("AI Booking Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create appointment",
    };
  }
}
