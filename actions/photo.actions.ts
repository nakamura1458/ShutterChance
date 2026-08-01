"use server";

import { getPhotos } from "@/services/photo.service";

export async function fetchPhotos(
  eventId:string
){
  return await getPhotos(eventId);
}