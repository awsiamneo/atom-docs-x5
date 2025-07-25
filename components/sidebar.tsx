"use client"

import { useState, useEffect, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Folder, FileText, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Category, Page } from "@/types"
import { fetchData } from "@/lib/api"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isEditMode: boolean
  onCollapseChange?: (collapsed: boolean) => void
}

// Memoized category item component to prevent unnecessary re-renders
const CategoryItem = memo(
  ({
    category,
    pages,
    isCollapsed,
    isExpanded,
    pathname,
    onToggle,
  }: {
    category: Category
    pages: Page[]
    isCollapsed: boolean
    isExpanded: boolean
    pathname: string
    onToggle: () => void
  }) => {
    const IconComponent = useMemo(() => {
      return category.icon && (LucideIcons as any)[category.icon] ? (LucideIcons as any)[category.icon] : Folder
    }, [category.icon])

    return (
      <div>
        <div
          className={cn(
            "flex items-center gap-2 mb-2 cursor-pointer glass-hover rounded-lg p-2 transition-colors duration-200",
            isCollapsed && "justify-center",
          )}
          onClick={() => !isCollapsed && onToggle()}
        >
          <IconComponent
            className="h-4 w-4 text-muted-foreground flex-shrink-0"
            style={{ color: category.iconColor || "currentColor" }}
          />
          {!isCollapsed && (
            <>
              <h3 className="font-medium text-sm flex-1 truncate">{category.name}</h3>
              <Badge variant="secondary" className="text-xs glass flex-shrink-0">
                {pages.length}
              </Badge>
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 flex-shrink-0 transition-transform duration-200" />
              ) : (
                <ChevronUp className="h-3 w-3 flex-shrink-0 transition-transform duration-200" />
              )}
            </>
          )}
        </div>

        {!isCollapsed && isExpanded && (
          <div className="ml-6 space-y-1">
            {pages.map((page) => (
              <PageLink key={page.id} page={page} pathname={pathname} />
            ))}
          </div>
        )}

        {isCollapsed && (
          <div className="space-y-1">
            {pages.map((page) => (
              <PageLink key={page.id} page={page} pathname={pathname} isCollapsed />
            ))}
          </div>
        )}
      </div>
    )
  },
)

CategoryItem.displayName = "CategoryItem"

// Memoized page link component with smooth active state transitions
const PageLink = memo(
  ({
    page,
    pathname,
    isCollapsed = false,
  }: {
    page: Page
    pathname: string
    isCollapsed?: boolean
  }) => {
    const IconComponent = useMemo(() => {
      return page.icon && (LucideIcons as any)[page.icon] ? (LucideIcons as any)[page.icon] : FileText
    }, [page.icon])

    const isActive = pathname === `/docs/${page.slug}`

    if (isCollapsed) {
      return (
        <Link
          href={`/docs/${page.slug}`}
          className={cn(
            "flex items-center justify-center p-2 rounded-lg text-sm transition-all duration-300 ease-in-out",
            "glass-hover",
            isActive ? "glass shadow-lg dark:shadow-none bg-primary/10 border border-primary/20" : "hover:bg-accent/50",
          )}
          title={page.title}
        >
          <IconComponent
            className={cn(
              "h-4 w-4 transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            style={{ color: isActive ? undefined : page.iconColor || "currentColor" }}
          />
        </Link>
      )
    }
    return (
      <>
        {
          isActive ? (
            <div className={`group relative dark:bg-[#000]/50  text-base font-bold rounded-md overflow-hidden transform transition-all duration-500  before:absolute before:w-16 before:h-full before:content[''] before:left-0 before:top-0 before:z-10 before:bg-[${page.iconColor}] before:rounded-full before:blur-2xl border border-transparent  shadow-lg dark:shadow-none`}>
              <Link
                href={`/docs/${page.slug}`}
                className={cn(
                  "flex items-center gap-2 p-2 text-sm transition-all duration-300 ease-in-out inset-0.5 z-[1] opacity-90 rounded-md dark:bg-[#323132] bg-[#fff]"
                )}
              >
                <IconComponent
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors duration-300 text-primary",
                  )}
                  style={{ color: page.iconColor }}
                />
                <span className="truncate">{page.title}</span>
              </Link>
            </div>
          ) : (
            <Link
              href={`/docs/${page.slug}`}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg text-sm transition-all duration-300 ease-in-out",
                "glass-hover hover:bg-accent/50 hover:text-accent-foreground",
              )}
            >
              <IconComponent
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors duration-300 text-muted-foreground",
                )}
                style={{ color: page.iconColor }}
              />
              <span className="truncate">{page.title}</span>
            </Link>
          )
        }
      </>
    )
  },
)
// <div className="relative h-full w-full overflow-hidden rounded-md bg-[f5f5f7] dark:bg-[#3d3c3d] drop-shadow-xl group shadow-lg dark:shadow-none ">
//   <Link
//     href={`/docs/${page.slug}`}
//     className={cn(
//       "flex items-center gap-2 p-2 text-sm transition-all duration-300 ease-in-out inset-0.5 z-[1] opacity-90 rounded-md dark:bg-[#323132]"
//     )}
//   >
//     <IconComponent
//       className={cn(
//         "h-3 w-3 flex-shrink-0 transition-colors duration-300 text-primary",
//       )}
//       style={{ color: page.iconColor }}
//     />
//     <span className="truncate">{page.title}</span>
//   </Link>
//   <div className={`absolute transition-all duration-500 top-1/2 -left-1/2 group-hover:top-10 group-hover:-left-1/4 h-4 w-10 -z-10 bg-${page.iconColor} blur-[30px]`} />
// </div>

PageLink.displayName = "PageLink"

export const Sidebar = memo(({ isEditMode, onCollapseChange }: SidebarProps) => {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [appTitle, setAppTitle] = useState("")
  const [isInitialized, setIsInitialized] = useState(false)

  // Memoize grouped pages to prevent recalculation on every render
  const groupedPages = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        acc[category.slug] = pages
          .filter((page) => page.category === category.slug)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
        return acc
      },
      {} as Record<string, Page[]>,
    )
  }, [categories, pages])

  // Memoize uncategorized pages
  const uncategorizedPages = useMemo(() => {
    return pages
      .filter((page) => !categories.some((cat) => cat.slug === page.category))
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [pages, categories])

  const loadData = useCallback(async () => {
    try {
      const data = await fetchData()
      // Sort categories by order
      const sortedCategories = [...data.categories].sort((a, b) => a.order - b.order)
      setCategories(sortedCategories)
      setPages(data.pages)

      // Only expand all categories on initial load
      if (!isInitialized) {
        setExpandedCategories(new Set(sortedCategories.map((cat) => cat.slug)))
        setIsInitialized(true)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [isInitialized])

  // Load collapse state from localStorage on mount only
  useEffect(() => {
    const savedCollapseState = localStorage.getItem("sidebar-collapsed")
    const collapsed = savedCollapseState === "true"
    setIsCollapsed(collapsed)
    onCollapseChange?.(collapsed)

    setAppTitle(process.env.NEXT_PUBLIC_APP_TITLE || "Atom Docs")
    loadData()
  }, []) // Empty dependency array - only run once on mount

  // Memoize toggle functions to prevent recreation on every render
  const toggleCategory = useCallback((categorySlug: string) => {
    setExpandedCategories((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(categorySlug)) {
        newExpanded.delete(categorySlug)
      } else {
        newExpanded.add(categorySlug)
      }
      return newExpanded
    })
  }, [])

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const newCollapsed = !prev
      localStorage.setItem("sidebar-collapsed", newCollapsed.toString())
      onCollapseChange?.(newCollapsed)
      return newCollapsed
    })
  }, [onCollapseChange])

  // Memoize category toggle handlers
  const categoryToggleHandlers = useMemo(() => {
    const handlers: Record<string, () => void> = {}
    categories.forEach((category) => {
      handlers[category.slug] = () => toggleCategory(category.slug)
    })
    handlers.uncategorized = () => toggleCategory("uncategorized")
    return handlers
  }, [categories, toggleCategory])

  return (
    <div
      className={cn(
        "fixed left-0 top-14 h-[calc(100vh-3.5rem)] glass-sidebar shadow-md dark:shadow-none z-40",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 flex-shrink-0">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold truncate transition-opacity duration-200">{appTitle}</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 glass-button shadow-md dark:shadow-none flex-shrink-0 transition-transform duration-200 hover:scale-105"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
            )}
          </Button>
        </div>

        <Separator className="flex-shrink-0" />

        {/* Scrollable Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full px-4 py-4">
            <div className="space-y-4">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  pages={groupedPages[category.slug] || []}
                  isCollapsed={isCollapsed}
                  isExpanded={expandedCategories.has(category.slug)}
                  pathname={pathname}
                  onToggle={categoryToggleHandlers[category.slug]}
                />
              ))}

              {uncategorizedPages.length > 0 && (
                <CategoryItem
                  key="uncategorized"
                  category={{
                    id: "uncategorized",
                    name: "Uncategorized",
                    slug: "uncategorized",
                    description: "Pages without a category",
                    icon: "Folder",
                    iconColor: "",
                    order: 999,
                    createdAt: "",
                  }}
                  pages={uncategorizedPages}
                  isCollapsed={isCollapsed}
                  isExpanded={expandedCategories.has("uncategorized")}
                  pathname={pathname}
                  onToggle={categoryToggleHandlers.uncategorized}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
})

Sidebar.displayName = "Sidebar"
