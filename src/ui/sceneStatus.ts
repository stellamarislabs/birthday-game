export function setSceneStatus(sceneName: string, statusText: string): void {
  document.body.dataset.scene = sceneName;
  document.body.dataset.sceneText = statusText;

  const status = document.getElementById("scene-status");
  if (status) {
    status.textContent = statusText;
  }
}
