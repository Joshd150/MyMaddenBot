import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getNews } from "@/lib/madden-firestore-db"
import type { NewsArticle } from "@/lib/madden-types"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export async function NewsSection() {
  const leagueId = process.env.LEAGUE_ID
  const newsArticles: NewsArticle[] = await getNews(leagueId!)

  return (
    <section id="news" className="py-12 md:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-10">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.length > 0 ? (
            newsArticles.map((article) => (
              <Card key={article.id} className="bg-gray-800 border-gray-700 text-white flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-300 mb-4">Source: {article.source}</p>
                  </div>
                  <Link
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline mt-4 flex items-center self-start"
                  >
                    Read More <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No News Available</h3>
              <p>Check back later for the latest updates from the league.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
