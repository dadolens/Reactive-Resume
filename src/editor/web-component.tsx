import fontCss from "@fontsource-variable/ibm-plex-sans/index.css?inline";
import iconCss from "@phosphor-icons/web/regular/style.css?inline";
import globalsCss from "@/styles/globals.css?inline";
import editorCss from "@/editor/editor.css?inline";

import { createRoot, type Root } from "react-dom/client";
import type { ResumeData } from "@/schema/resume/data";
import { defaultResumeData } from "@/schema/resume/data";
import { EditorApp } from "@/editor/app";
import type { Theme } from "@/utils/theme";
import { isRTL, type Locale } from "@/utils/locale";

const DEFAULT_ASSETS_BASE_URL = new URL(".", import.meta.url).toString();
const INLINE_CSS = [fontCss, iconCss, globalsCss, editorCss].join("\n");

class ResumeEditorElement extends HTMLElement {
	private root: Root | null = null;
	private container: HTMLDivElement | null = null;
	private styleLink: HTMLLinkElement | null = null;
	private inlineStyle: HTMLStyleElement | null = null;
	private baseStyle: HTMLStyleElement | null = null;
	private currentValue: ResumeData = defaultResumeData;
	private locale: Locale = "en-US";
	private theme: Theme = "light";
	private assetsBaseUrl: string = DEFAULT_ASSETS_BASE_URL;
	private showPageNumbers = true;
	private cssHref: string | null = null;
	private internalUpdate = false;

	static get observedAttributes() {
		return ["value", "locale", "theme", "assets-base-url", "show-page-numbers", "css-href"];
	}

	connectedCallback() {
		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
		}

		if (!this.container) {
			this.container = document.createElement("div");
			this.container.setAttribute("part", "container");
			this.shadowRoot?.appendChild(this.container);
		}

		this.ensureBaseStyle();
		this.ensureStyles();

		if (!this.root && this.container) {
			this.root = createRoot(this.container);
		}

		this.render();
	}

	disconnectedCallback() {
		this.root?.unmount();
		this.root = null;
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
		if (name === "css-href") {
			this.cssHref = newValue && newValue.trim().length > 0 ? newValue : null;
			this.ensureStyles();
			return;
		}

		if (newValue === null) return;

		switch (name) {
			case "value": {
				try {
					const parsed = JSON.parse(newValue) as ResumeData;
					this.value = parsed;
				} catch {
					// ignore invalid JSON
				}
				break;
			}
			case "locale": {
				this.locale = newValue as Locale;
				this.render();
				break;
			}
			case "theme": {
				this.theme = newValue as Theme;
				this.render();
				break;
			}
			case "assets-base-url": {
				this.assetsBaseUrl = newValue || DEFAULT_ASSETS_BASE_URL;
				this.render();
				break;
			}
			case "show-page-numbers": {
				this.showPageNumbers = newValue !== "false";
				this.render();
				break;
			}
			default:
				break;
		}
	}

	get value() {
		return this.currentValue;
	}

	set value(nextValue: ResumeData) {
		this.currentValue = nextValue ?? defaultResumeData;
		if (this.internalUpdate) return;
		this.render();
	}

	private ensureStyles() {
		if (!this.shadowRoot) return;
		if (this.cssHref) {
			this.removeInlineStyle();
			this.ensureStyleLink();
			return;
		}

		this.removeStyleLink();
		this.ensureInlineStyle();
	}

	private ensureStyleLink() {
		if (!this.shadowRoot) return;
		if (!this.styleLink) {
			this.styleLink = document.createElement("link");
			this.styleLink.setAttribute("rel", "stylesheet");
			this.styleLink.setAttribute("part", "styles");
			this.shadowRoot.prepend(this.styleLink);
		}
		this.styleLink.href = this.cssHref ?? "";
	}

	private ensureInlineStyle() {
		if (!this.shadowRoot) return;
		if (!this.inlineStyle) {
			this.inlineStyle = document.createElement("style");
			this.inlineStyle.setAttribute("part", "styles");
			this.shadowRoot.prepend(this.inlineStyle);
		}
		this.inlineStyle.textContent = INLINE_CSS;
	}

	private removeStyleLink() {
		this.styleLink?.remove();
		this.styleLink = null;
	}

	private removeInlineStyle() {
		this.inlineStyle?.remove();
		this.inlineStyle = null;
	}

	private ensureBaseStyle() {
		if (!this.shadowRoot) return;
		if (this.baseStyle) return;
		this.baseStyle = document.createElement("style");
		this.baseStyle.textContent = `:host{display:block;width:100%;height:100%;}`;
		this.shadowRoot.prepend(this.baseStyle);
	}

	private handleChange = (data: ResumeData) => {
		this.internalUpdate = true;
		this.currentValue = data;
		this.dispatchEvent(new CustomEvent("resume-change", { detail: data, bubbles: true, composed: true }));
		this.internalUpdate = false;
	};

	private render() {
		if (!this.root || !this.container) return;

		this.container.classList.toggle("dark", this.theme === "dark");
		this.container.setAttribute("dir", isRTL(this.locale) ? "rtl" : "ltr");
		this.container.classList.add("resume-editor");

		this.root.render(
			<EditorApp
				value={this.currentValue}
				onChange={this.handleChange}
				locale={this.locale}
				theme={this.theme}
				assetsBaseUrl={this.assetsBaseUrl}
				portalContainer={this.container}
				showPageNumbers={this.showPageNumbers}
				className="resume-editor"
			/>,
		);
	}
}

if (!customElements.get("resume-editor")) {
	customElements.define("resume-editor", ResumeEditorElement);
}
