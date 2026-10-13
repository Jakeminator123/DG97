function getRoomCategory(room, publishedVacancy, conferenceRooms = []) {
  const roomId = Number(room?.rum);
  if (roomId === 23 || room?.type === 'konferensrum' || conferenceRooms.includes(roomId)) {
    return 'conference';
  }
  if (!Number.isInteger(roomId) || roomId < 1 || roomId > 22) return 'other';
  return publishedVacancy ? 'vacant' : 'office';
}

module.exports = { getRoomCategory };
