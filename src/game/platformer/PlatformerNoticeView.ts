import Phaser from "phaser";
import { PHASER_THEME, THEME_HEX } from "../../ui/theme";

export type PlatformerNoticeVariant = "title" | "status" | "hint" | "clue" | "checkpoint" | "sound";

interface PlatformerNoticeViewOptions {
  x: number;
  y: number;
  originX?: number;
  originY?: number;
  variant: PlatformerNoticeVariant;
  text?: string;
  maxWidth?: number;
  minWidth?: number;
  depth?: number;
}

interface NoticeStyle {
  fontSize: string;
  color: string;
  panelFill: number;
  panelAlpha: number;
  border: number;
  borderAlpha: number;
  accent: number;
  accentAlpha: number;
  glow: number;
  glowAlpha: number;
  paddingX: number;
  paddingY: number;
  radius: number;
  maxWidth: number;
  minWidth: number;
}

const NOTICE_STYLES: Record<PlatformerNoticeVariant, NoticeStyle> = {
  title: {
    fontSize: "28px",
    color: THEME_HEX.softIvory,
    panelFill: PHASER_THEME.midnightNavy,
    panelAlpha: 0.9,
    border: PHASER_THEME.antiqueGold,
    borderAlpha: 0.74,
    accent: PHASER_THEME.burgundy,
    accentAlpha: 0.42,
    glow: PHASER_THEME.brassHighlight,
    glowAlpha: 0.14,
    paddingX: 22,
    paddingY: 13,
    radius: 8,
    maxWidth: 700,
    minWidth: 240
  },
  status: {
    fontSize: "17px",
    color: THEME_HEX.softParchment,
    panelFill: PHASER_THEME.deepBlueNavy,
    panelAlpha: 0.78,
    border: PHASER_THEME.antiqueGold,
    borderAlpha: 0.45,
    accent: PHASER_THEME.brassHighlight,
    accentAlpha: 0.34,
    glow: PHASER_THEME.midnightNavy,
    glowAlpha: 0.12,
    paddingX: 13,
    paddingY: 8,
    radius: 7,
    maxWidth: 330,
    minWidth: 160
  },
  hint: {
    fontSize: "18px",
    color: THEME_HEX.softIvory,
    panelFill: PHASER_THEME.midnightNavy,
    panelAlpha: 0.9,
    border: PHASER_THEME.antiqueGold,
    borderAlpha: 0.62,
    accent: PHASER_THEME.burgundy,
    accentAlpha: 0.56,
    glow: PHASER_THEME.brassHighlight,
    glowAlpha: 0.12,
    paddingX: 17,
    paddingY: 10,
    radius: 8,
    maxWidth: 660,
    minWidth: 220
  },
  clue: {
    fontSize: "19px",
    color: THEME_HEX.softIvory,
    panelFill: PHASER_THEME.deepBlueNavy,
    panelAlpha: 0.93,
    border: PHASER_THEME.brassHighlight,
    borderAlpha: 0.78,
    accent: PHASER_THEME.deepGold,
    accentAlpha: 0.5,
    glow: PHASER_THEME.brassHighlight,
    glowAlpha: 0.22,
    paddingX: 18,
    paddingY: 11,
    radius: 8,
    maxWidth: 680,
    minWidth: 250
  },
  checkpoint: {
    fontSize: "18px",
    color: THEME_HEX.mainCream,
    panelFill: PHASER_THEME.warmInkBrown,
    panelAlpha: 0.9,
    border: PHASER_THEME.antiqueGold,
    borderAlpha: 0.68,
    accent: PHASER_THEME.brassHighlight,
    accentAlpha: 0.42,
    glow: PHASER_THEME.antiqueGold,
    glowAlpha: 0.16,
    paddingX: 16,
    paddingY: 10,
    radius: 8,
    maxWidth: 560,
    minWidth: 210
  },
  sound: {
    fontSize: "16px",
    color: THEME_HEX.brassHighlight,
    panelFill: PHASER_THEME.midnightNavy,
    panelAlpha: 0.78,
    border: PHASER_THEME.antiqueGold,
    borderAlpha: 0.44,
    accent: PHASER_THEME.burgundy,
    accentAlpha: 0.3,
    glow: PHASER_THEME.deepBlueNavy,
    glowAlpha: 0.12,
    paddingX: 12,
    paddingY: 7,
    radius: 7,
    maxWidth: 260,
    minWidth: 120
  }
};

export class PlatformerNoticeView {
  private readonly container: Phaser.GameObjects.Container;
  private readonly panel: Phaser.GameObjects.Graphics;
  private readonly label: Phaser.GameObjects.Text;
  private variant: PlatformerNoticeVariant;
  private readonly originX: number;
  private readonly originY: number;
  private readonly maxWidthOverride?: number;
  private readonly minWidthOverride?: number;

  constructor(private readonly scene: Phaser.Scene, options: PlatformerNoticeViewOptions) {
    this.variant = options.variant;
    this.originX = options.originX ?? 0.5;
    this.originY = options.originY ?? 0.5;
    this.maxWidthOverride = options.maxWidth;
    this.minWidthOverride = options.minWidth;
    this.panel = scene.add.graphics();
    this.label = scene.add.text(0, 0, "", {
      fontFamily: "Georgia, 'Palatino Linotype', 'Times New Roman', serif",
      align: "center"
    });
    this.container = scene.add
      .container(options.x, options.y, [this.panel, this.label])
      .setScrollFactor(0)
      .setDepth(options.depth ?? 50);
    this.setText(options.text ?? "");
  }

  setText(text: string): this {
    const style = this.currentStyle();
    const wrapWidth = style.maxWidth - style.paddingX * 2;
    this.label.setStyle({
      fontFamily: "Georgia, 'Palatino Linotype', 'Times New Roman', serif",
      fontSize: style.fontSize,
      fontStyle: this.variant === "title" ? "bold" : "",
      color: style.color,
      align: "center",
      wordWrap: { width: wrapWidth, useAdvancedWrap: true }
    });
    this.label.setText(text);
    this.redraw();
    return this;
  }

  setVariant(variant: PlatformerNoticeVariant): this {
    if (this.variant === variant) {
      return this;
    }

    this.variant = variant;
    this.redraw();
    return this;
  }

  setVisible(visible: boolean): this {
    if (!visible) {
      this.container.setVisible(false);
      return this;
    }

    this.container.setVisible(true);
    if (this.reducedMotion()) {
      this.container.setAlpha(1);
      return this;
    }

    this.scene.tweens.killTweensOf(this.container);
    this.container.setAlpha(0.85);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 130,
      ease: "Sine.easeOut"
    });
    return this;
  }

  setPosition(x: number, y: number): this {
    this.container.setPosition(x, y);
    return this;
  }

  setDepth(depth: number): this {
    this.container.setDepth(depth);
    return this;
  }

  destroy(): void {
    this.container.destroy(true);
  }

  private redraw(): void {
    const style = this.currentStyle();
    const width = Math.max(style.minWidth, this.label.width + style.paddingX * 2);
    const height = this.label.height + style.paddingY * 2;
    const x = -width * this.originX;
    const y = -height * this.originY;

    this.panel.clear();
    this.panel.fillStyle(style.glow, style.glowAlpha);
    this.panel.fillRoundedRect(x - 5, y - 4, width + 10, height + 8, style.radius + 4);
    this.panel.fillStyle(style.panelFill, style.panelAlpha);
    this.panel.fillRoundedRect(x, y, width, height, style.radius);
    this.panel.lineStyle(1, style.border, style.borderAlpha);
    this.panel.strokeRoundedRect(x + 0.5, y + 0.5, width - 1, height - 1, style.radius);
    this.panel.fillStyle(style.accent, style.accentAlpha);
    this.panel.fillRoundedRect(x + 7, y + height - 5, width - 14, 2, 2);
    this.panel.fillStyle(PHASER_THEME.softParchment, 0.08);
    this.panel.fillRoundedRect(x + 8, y + 7, Math.max(18, width * 0.24), 2, 2);
    this.label.setPosition(x + style.paddingX, y + style.paddingY);
  }

  private currentStyle(): NoticeStyle {
    const base = NOTICE_STYLES[this.variant];
    return {
      ...base,
      maxWidth: this.maxWidthOverride ?? base.maxWidth,
      minWidth: this.minWidthOverride ?? base.minWidth
    };
  }

  private reducedMotion(): boolean {
    return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }
}
