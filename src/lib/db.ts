import { EventConfig, Guest, Wish } from "./types";
import {
  getPgConfig,
  updatePgConfig,
  getPgGuests,
  getPgGuestBySlug,
  getPgGuestByName,
  addPgGuest,
  updatePgGuest,
  deletePgGuest,
  checkInPgGuest,
  submitPgRSVP,
  getPgWishes,
  deletePgWish,
} from "./postgres";

export async function getConfig(): Promise<EventConfig> {
  return await getPgConfig();
}

export async function updateConfig(updates: Partial<EventConfig>): Promise<EventConfig> {
  return await updatePgConfig(updates);
}

export async function getGuests(): Promise<Guest[]> {
  return await getPgGuests();
}

export async function getGuestBySlug(slug: string): Promise<Guest | undefined> {
  return await getPgGuestBySlug(slug);
}

export async function getGuestByName(name: string): Promise<Guest | undefined> {
  return await getPgGuestByName(name);
}

export async function addGuest(
  guestData: Omit<Guest, "id" | "createdAt" | "updatedAt">
): Promise<Guest> {
  return await addPgGuest(guestData);
}

export async function updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
  return await updatePgGuest(id, updates);
}

export async function deleteGuest(id: string): Promise<boolean> {
  return await deletePgGuest(id);
}

export async function checkInGuest(
  codeOrIdOrName: string,
  panitiaName: string = "Panitia Resepsionis",
  walkInData?: { category?: string; instance?: string; phone?: string }
): Promise<{ success: boolean; guest?: Guest; message: string; alreadyAttended?: boolean }> {
  return await checkInPgGuest(codeOrIdOrName, panitiaName, walkInData);
}

export async function submitRSVP(params: {
  identifier: string;
  name?: string;
  category?: string;
  status: "attending" | "declined" | "unsure";
  pax?: number;
  message?: string;
}): Promise<{ success: boolean; guest?: Guest; wish?: Wish }> {
  return await submitPgRSVP(params);
}

export async function getWishes(): Promise<Wish[]> {
  return await getPgWishes();
}

export async function deleteWish(id: string): Promise<boolean> {
  return await deletePgWish(id);
}
