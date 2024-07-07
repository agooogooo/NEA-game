export function collisions(player, object, newPosition) {
  const playerHitbox = hitboxes(player, newPosition);
  const objectHitbox = hitboxes(object);

  if (((playerHitbox.x < objectHitbox.x + objectHitbox.width) && (playerHitbox.x + playerHitbox.width > objectHitbox.x)) &&
      ((playerHitbox.y < objectHitbox.y + objectHitbox.height) && (playerHitbox.y + playerHitbox.height > objectHitbox.y))) {
    console.log("collision");
    return true;
  }
  return false;
}
