export default function QuestionPanel({question,current}:any){

if(!question) return null

return(

<div className="cosmos-card col-span-2">

<h3 className="text-sm text-gray-400">

Question {current+1}

</h3>

<p className="mt-3 text-lg">

{question.question}

</p>

<textarea
className="w-full mt-4 bg-black/50 border border-white/10 rounded p-3"
rows={6}
/>

</div>

)

}