import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomUtil {
  public getLowerPricePerMonth(
    rooms: { pricePerMonth: number }[],
  ): number | null {
    if (!rooms.length) return null;

    return rooms.reduce(
      (min, room) => (room.pricePerMonth < min ? room.pricePerMonth : min),
      rooms[0].pricePerMonth,
    );
  }
}
